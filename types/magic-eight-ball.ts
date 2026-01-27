import type { Asset } from "./asset";
import type { GraphQLError } from "./gql-error";
import type { User } from "./user";

export interface MagicEightBall {
  _id: string;
  name?: string;
  locale?: string;
  description?: string;
  diceNumber?: number;
  primaryColor?: string;
  status?: "active" | "paused" | "deleted";
  primaryAsset?: Asset;
  backgroundAsset?: Asset;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface GetMagicEightBallSuccessResponse {
  data: {
    magicEightBallSide: MagicEightBall;
  };
  errors?: never;
}

export interface GetMagicEightBallErrorResponse {
  errors: GraphQLError[];
  data: null;
}

export type GetMagicEightBallResponse =
  | GetMagicEightBallSuccessResponse
  | GetMagicEightBallErrorResponse;
export interface GetMagicEightBallInput {
  id: string;
}
