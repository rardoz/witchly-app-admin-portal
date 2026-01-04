import type { GraphQLError } from "./gql-error";
import type { User } from "./user";

export interface Horoscope {
  _id: string;
  horoscopeText: string;
  sign: string;
  locale: string;
  horoscopeDate: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  user: User;
}

export interface GetHoroscopeSuccessResponse {
  data: {
    horoscope: Horoscope;
  };
  errors?: never;
}

export interface GetHoroscopeErrorResponse {
  errors: GraphQLError[];
  data: null;
}

export type GetHoroscopeResponse =
  | GetHoroscopeSuccessResponse
  | GetHoroscopeErrorResponse;
export interface GetHoroscopeInput {
  id: string;
}
