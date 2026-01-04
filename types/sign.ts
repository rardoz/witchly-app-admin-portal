import type { Asset } from "./asset";
import type { GraphQLError } from "./gql-error";

export interface Sign {
  _id: string;
  sign: string;
  locale: string;
  description: string;
  signDateStart: string;
  signDateEnd: string;
  handle: string;
  asset: Asset | null;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetSignSuccessResponse {
  data: {
    sign: Sign;
  };
  errors?: never;
}

export interface GetSignErrorResponse {
  errors: GraphQLError[];
  data: {
    sign: null;
  };
}

export type GetSignResponse = GetSignSuccessResponse | GetSignErrorResponse;
export interface GetSignInput {
  id: string;
}
