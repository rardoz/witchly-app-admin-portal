import type { Asset } from "./asset";
import type { GraphQLError } from "./gql-error";
import type { User } from "./user";

export interface TarotDeck {
  _id: string;
  name?: string;
  locale?: string;
  user?: User;
  primaryAsset?: Asset | null;
  cardBackgroundAsset?: Asset | null;
  primaryColor?: string;
  description?: string;
  author?: string;
  meta?: string[];
  layoutType?: string;
  layoutCount?: number;
  status: "active" | "paused" | "deleted";
  createdAt: string;
  updatedAt: string;
}

export interface GetTarotDeckSuccessResponse {
  data: {
    tarotDeck: TarotDeck;
  };
  errors?: never;
}

export interface GetTarotDeckErrorResponse {
  errors: GraphQLError[];
  data: {
    tarotDeck: null;
  };
}

export type GetTarotDeckResponse =
  | GetTarotDeckSuccessResponse
  | GetTarotDeckErrorResponse;
export interface GetTarotDeckInput {
  id: string;
}
