interface AppTokenCache {
  token: string;
  expiresAt: number;
}

let appTokenCache: AppTokenCache | null = null;

export async function getAppToken(): Promise<AppTokenCache> {
  // Return cached token if still valid (with 5 minute buffer)
  if (appTokenCache && Date.now() < appTokenCache.expiresAt - 300000) {
    return appTokenCache;
  }
  // Fetch new app token
  const res = await fetch(`${process.env.API_BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `mutation Authenticate($grantType: String!, $clientId: String!, $clientSecret: String!, $scope: String!) {
        authenticate(grant_type: $grantType, client_id: $clientId, client_secret: $clientSecret, scope: $scope) {
          access_token
          token_type
          expires_in
          scope
        }
      }`,
      variables: {
        grantType: "client_credentials",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scope: process.env.APP_SCOPE,
      },
    }),
  });

  const data = await res.json();

  if (data.errors) {
    throw new Error(`Failed to get app token: ${data.errors[0].message}`);
  }

  const { access_token, expires_in } = data.data.authenticate;

  // Cache the token
  appTokenCache = {
    token: access_token,
    expiresAt: Date.now() + expires_in * 1000,
  };

  return appTokenCache;
}

// Helper to clear cache (useful for testing or forced refresh)
export function clearAppTokenCache() {
  appTokenCache = null;
}
