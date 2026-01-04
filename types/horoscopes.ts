import type { GraphQLError } from "./gql-error";
import type { Horoscope } from "./horoscope";
export interface HoroscopesData {
  records: Horoscope[];
  totalCount: number;
}
export interface GetHoroscopesSuccessResponse {
  data: {
    horoscopes: HoroscopesData | null;
  };
  errors?: never;
}

export interface GetHoroscopesErrorResponse {
  errors: GraphQLError[];
  data: {
    horoscopes: HoroscopesData | null;
  };
}

export type GetHoroscopesResponse =
  | GetHoroscopesSuccessResponse
  | GetHoroscopesErrorResponse;
export interface GetHoroscopesInput {
  locale?: string;
  horoscopeDate?: string;
  status?: string;
  sign?: string;
  limit?: number;
  offset?: number;
}
