import type { GraphQLError } from "./gql-error";
import type { SpellbookPage } from "./spellbook-page";

export interface SpellbookPagesData {
  records: SpellbookPage[];
  totalCount: number;
}

export interface GetSpellbookPagesSuccessResponse {
  data: {
    spellbookPages: SpellbookPagesData | null;
  };
  errors?: never;
}

export interface GetSpellbookPagesErrorResponse {
  errors: GraphQLError[];
  data: {
    spellbookPages: SpellbookPagesData | null;
  };
}

export type GetSpellbookPagesResponse =
  | GetSpellbookPagesSuccessResponse
  | GetSpellbookPagesErrorResponse;

export interface GetSpellbookPagesInput {
  spellbookId: string;
  status?: string;
  visibility?: string;
  limit?: number;
  offset?: number;
}
