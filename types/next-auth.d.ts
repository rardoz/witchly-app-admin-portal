import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    userToken: string;
    refreshToken: string;
    expiresAt: string;
    expiresIn: number;
    scopes: string[];
  }

  interface Session {
    appToken?: string;
    appTokenExpiresIn?: number;
    userToken?: string;
    error?: string;
    user: {
      id: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userToken?: string;
    refreshToken?: string;
    expiresAt?: string;
    userId?: string;
    email?: string;
    error?: string;
  }
}
