import type { Asset } from "./asset";
import type { GraphQLError } from "./gql-error";
import type { TarotDeck } from "./tarot-deck";
import type { User } from "./user";

export interface TarotCard {
  _id: string;
  name?: string;
  locale?: string;
  tarotCardNumber?: number;
  user?: User;
  primaryAsset?: Asset | null;
  description?: string;
  meta?: string[];
  status: "active" | "paused" | "deleted";
  createdAt: string;
  updatedAt: string;
  tarotDeck: TarotDeck;
}

export interface GetTarotCardSuccessResponse {
  data: {
    tarotCard: TarotCard;
  };
  errors?: never;
}

export interface GetTarotCardErrorResponse {
  errors: GraphQLError[];
  data: {
    tarotDeck: null;
  };
}

export type GetTarotCardResponse =
  | GetTarotCardSuccessResponse
  | GetTarotCardErrorResponse;
export interface GetTarotCardInput {
  id: string;
}
