import type { GraphQLError } from "./gql-error";
import type { MoonPhase } from "./moon-phase";
export interface MoonPhasesData {
  records: MoonPhase[];
  totalCount: number;
}
export interface GetMoonPhasesSuccessResponse {
  data: {
    moonPhases: MoonPhasesData | null;
  };
  errors?: never;
}

export interface GetMoonPhasesErrorResponse {
  errors: GraphQLError[];
  data: {
    moonPhases: MoonPhasesData | null;
  };
}

export type GetMoonPhasesResponse =
  | GetMoonPhasesSuccessResponse
  | GetMoonPhasesErrorResponse;
export interface GetMoonPhasesInput {
  locale?: string;
  phase?: string;
  status?: string;
  limit?: number;
  offset?: number;
}
