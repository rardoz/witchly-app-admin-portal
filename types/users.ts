import type { GraphQLError } from "./gql-error";
import type { User } from "./user";
export interface UsersData {
  records: User[];
  totalCount: number;
}
export interface GetUsersSuccessResponse {
  data: {
    users: UsersData | null;
  };
  errors?: never;
}

export interface GetUsersErrorResponse {
  errors: GraphQLError[];
  data: {
    users: UsersData | null;
  };
}

export type GetUsersResponse = GetUsersSuccessResponse | GetUsersErrorResponse;
export interface GetUsersInput {
  handle?: string;
  email?: string;
  limit?: number;
  offset?: number;
}
