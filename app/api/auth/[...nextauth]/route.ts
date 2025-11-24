import type { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAppToken } from "@/lib/auth/app-token";
import gqlRequest from "@/lib/gql";

async function refreshToken(token: string) {
  const query = `
   mutation RefreshSession($input: RefreshSessionInput!) {    
        refreshSession(input: $input) {        
            sessionToken        
            refreshToken        
            expiresIn       
            expiresAt    
        }
    }
  `;

  const json = await gqlRequest(query, { input: { refreshToken: token } });

  const data = json.data?.refreshSession;
  if (!data) return {}; // fallback if refresh fails

  return {
    accessToken: data.sessionToken,
    refreshToken: data.refreshToken,
    expiresAt: data.expiresAt,
    expiresIn: data.expiresIn,
  };
}

export const authOptions: AuthOptions = {
  pages: { signIn: "/login", error: "/login" },
  session: {
    strategy: "jwt",
  },
  debug: true,
  providers: [
    // USER LOGIN WITH EMAIL + VERIFICATION CODE
    CredentialsProvider({
      id: "credentials", // Explicit ID so the callback route is /api/auth/callback/credentials
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        verificationCode: { label: "Verification Code", type: "text" },
        keepMeLoggedIn: { label: "Keep me logged in", type: "checkbox" },
      },

      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);
        if (!credentials?.email || !credentials?.verificationCode) {
          console.log("Missing credentials");
          return null;
        }

        const data = await gqlRequest(
          `
            mutation CompleteLogin($input: CompleteLoginInput!) {   
                completeLogin(input: $input) {
                    success
                    message
                    sessionToken
                    refreshToken
                    expiresIn
                    expiresAt
                    userId
                    scopes
                }
            }
          `,
          {
            input: {
              email: credentials.email,
              verificationCode: credentials.verificationCode,
              keepMeLoggedIn: credentials.keepMeLoggedIn === "true",
            },
          },
        );

        if (data.errors || !data.data?.completeLogin?.success) {
          console.log("Invalid login: ", data.errors || data);
          return null;
        }
        const loginData = data.data.completeLogin;

        return {
          id: loginData.userId,
          email: credentials.email,
          userToken: loginData.sessionToken,
          refreshToken: loginData.refreshToken,
          expiresAt: loginData.expiresAt,
          expiresIn: loginData.expiresIn,
          scopes: loginData.scopes,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Store user login token
      if (user) {
        token.userToken = user.userToken;
        token.expiresAt = user.expiresAt;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.email = user.email;
        token.expiresIn = user.expiresIn;
        token.scopes = user.scopes;
        return token;
      }

      if (token.expiresAt) {
        // Token still valid?
        const now = Date.now();
        const expiresAt = new Date(token.expiresAt).getTime();
        if (now < expiresAt - 60000) {
          return token;
        } else if (token.refreshToken) {
          console.log("Token expired, refreshing...");

          // Otherwise refresh it
          const res = await refreshToken(token.refreshToken);
          token.refreshToken = res.refreshToken;
          token.userToken = res.accessToken;
          token.expiresAt = res.expiresAt;
          token.expiresIn = res.expiresIn;
        } else {
          console.log("No refresh token available, cannot refresh.");
          return {};
        }
      }
      return token;
    },

    async session({ session, token }) {
      const appToken = await getAppToken();
      if (token.error) {
        session.error = token.error;
      }
      session.userToken = token.userToken;
      session.appToken = appToken.token;
      session.appTokenExpiresIn = appToken.expiresAt;
      session.user = {
        ...session.user,
        id: token.userId as string,
        email: token.email as string,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
