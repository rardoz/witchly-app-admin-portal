import type { Asset } from "./asset";
import type { GraphQLError } from "./gql-error";
import type { User } from "./user";

export interface MoonPhase {
  _id: string;
  phase: string;
  phaseLocal: string;
  locale: string;
  description: string;
  primaryAsset: Asset | null;
  backgroundAsset: Asset | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  primaryColor: string;
  number: number;
  user: User;
}

export interface GetMoonPhaseSuccessResponse {
  data: {
    moonPhase: MoonPhase;
  };
  errors?: never;
}

export interface GetMoonPhaseErrorResponse {
  errors: GraphQLError[];
  data: null;
}

export type GetMoonPhaseResponse =
  | GetMoonPhaseSuccessResponse
  | GetMoonPhaseErrorResponse;
export interface GetMoonPhaseInput {
  id: string;
}
