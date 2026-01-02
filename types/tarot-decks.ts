import type { GraphQLError } from "./gql-error";
import type { TarotDeck } from "./tarot-deck";
export interface TarotDecksData {
  records: TarotDeck[];
  totalCount: number;
}
export interface GetTarotDecksSuccessResponse {
  data: {
    tarotDecks: TarotDecksData | null;
  };
  errors?: never;
}

export interface GetTarotDecksErrorResponse {
  errors: GraphQLError[];
  data: {
    tarotDecks: TarotDecksData | null;
  };
}

export type GetTarotDecksResponse =
  | GetTarotDecksSuccessResponse
  | GetTarotDecksErrorResponse;
export interface GetTarotDecksInput {
  locale?: string;
  status?: string;
  limit?: number;
  offset?: number;
}
