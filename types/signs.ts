import type { GraphQLError } from "./gql-error";
import type { Sign } from "./sign";
export interface SignsData {
  records: Sign[];
  totalCount: number;
}
export interface GetSignsSuccessResponse {
  data: {
    getHoroscopeSigns: SignsData | null;
  };
  errors?: never;
}

export interface GetSignsErrorResponse {
  errors: GraphQLError[];
  data: {
    getHoroscopeSigns: SignsData | null;
  };
}

export type GetSignsResponse = GetSignsSuccessResponse | GetSignsErrorResponse;
export interface GetSignsInput {
  locale?: string;
  sign?: string;
  limit?: number;
  offset?: number;
}
