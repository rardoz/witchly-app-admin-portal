import type { Asset } from "./asset";
import type { GraphQLError } from "./gql-error";

export interface User {
  id: string;
  name: string;
  email: string;
  handle: string;
  allowedScopes: string[];
  emailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  profileAsset: Asset | null;
  bio: string;
  shortBio: string;
  backdropAsset: Asset | null;
  instagramHandle: string;
  tikTokHandle: string;
  twitterHandle: string;
  websiteUrl: string;
  facebookUrl: string;
  snapchatHandle: string;
  primaryColor: string;
  sign: string;
  sex: string;
  location: string;
  birthDate: string;
  pronouns: string;
}

export interface GetUserSuccessResponse {
  data: {
    user: User;
  };
  errors?: never;
}

export interface GetUserErrorResponse {
  errors: GraphQLError[];
  data: {
    user: null;
  };
}

export type GetUserResponse = GetUserSuccessResponse | GetUserErrorResponse;

export interface GetUserInput {
  id: string;
}
