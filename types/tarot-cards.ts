import type { GraphQLError } from "./gql-error";
import type { TarotCard } from "./tarot-card";

export interface TarotCardsData {
  records: TarotCard[];
  totalCount: number;
  limit: number;
  offset: number;
}

export interface GetTarotCardsSuccessResponse {
  data: {
    tarotCards: TarotCardsData | null;
  };
  errors?: never;
}

export interface GetTarotCardsErrorResponse {
  errors: GraphQLError[];
  data: {
    tarotCards: TarotCardsData | null;
  };
}

export type GetTarotCardsResponse =
  | GetTarotCardsSuccessResponse
  | GetTarotCardsErrorResponse;

export interface GetTarotCardsInput {
  tarotDeckId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}
