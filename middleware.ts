import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      //todo we need to pass back the user role in the api
      authorized: ({ token }) => {
        // Reject if there's a refresh error (forces re-login)
        if (token?.error === "RefreshTokenError") {
          console.log("Token refresh failed, forcing re-authentication");
          return false;
        } else if (
          token?.expiresAt &&
          new Date(token?.expiresAt).getTime() < Date.now()
        ) {
          console.log("Token expired, forcing re-authentication");
          return false;
        }
        return (token?.scopes as string[])?.includes("admin");
      },
    },
  },
);

export const config = { matcher: ["/"] };
