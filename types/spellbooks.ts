import type { GraphQLError } from "./gql-error";
import type { Spellbook } from "./spellbook";

export interface SpellbooksData {
  records: Spellbook[];
  totalCount: number;
}

export interface GetSpellbooksSuccessResponse {
  data: {
    spellbooks: SpellbooksData | null;
  };
  errors?: never;
}

export interface GetSpellbooksErrorResponse {
  errors: GraphQLError[];
  data: {
    spellbooks: SpellbooksData | null;
  };
}

export type GetSpellbooksResponse =
  | GetSpellbooksSuccessResponse
  | GetSpellbooksErrorResponse;

export interface GetSpellbooksInput {
  status?: string;
  visibility?: string;
  limit?: number;
  offset?: number;
}
