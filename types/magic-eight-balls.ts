import type { GraphQLError } from "./gql-error";
import type { MagicEightBall } from "./magic-eight-ball";
export interface MagicEightBallsData {
  records: MagicEightBall[];
  totalCount: number;
}
export interface GetMagicEightBallsSuccessResponse {
  data: {
    magicEightBallSides: MagicEightBallsData | null;
  };
  errors?: never;
}

export interface GetMagicEightBallsErrorResponse {
  errors: GraphQLError[];
  data: {
    magicEightBallSides: MagicEightBallsData | null;
  };
}

export type GetMagicEightBallsResponse =
  | GetMagicEightBallsSuccessResponse
  | GetMagicEightBallsErrorResponse;
export interface GetMagicEightBallsInput {
  locale?: string;
  status?: "active" | "paused" | "deleted" | undefined;
  limit?: number;
  offset?: number;
}
