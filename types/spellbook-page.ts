import type { Asset } from "./asset";
import type { GraphQLError } from "./gql-error";
import type { User } from "./user";

export interface SpellbookPage {
  id: string;
  title?: string;
  richText?: string;
  shortDescription?: string;
  user?: User;
  spellbook?: string;
  primaryAsset?: Asset | null;
  backgroundAsset?: Asset | null;
  primaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  font?: string;
  status: "active" | "pending" | "deleted";
  visibility: "public" | "private";
  meta?: string[];
  allowedUsers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetSpellbookPageSuccessResponse {
  data: {
    spellbookPage: SpellbookPage;
  };
  errors?: never;
}

export interface GetSpellbookPageErrorResponse {
  errors: GraphQLError[];
  data: {
    spellbookPage: null;
  };
}

export type GetSpellbookPageResponse =
  | GetSpellbookPageSuccessResponse
  | GetSpellbookPageErrorResponse;

export interface GetSpellbookPageInput {
  id: string;
}
