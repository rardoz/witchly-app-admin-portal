import type { Asset } from "./asset";
import type { GraphQLError } from "./gql-error";
import type { User } from "./user";

export interface Spellbook {
  id: string;
  title?: string;
  description?: string;
  user?: User;
  primaryAsset?: Asset | null;
  backgroundAsset?: Asset | null;
  primaryColor?: string;
  textColor?: string;
  font?: string;
  status: "active" | "pending" | "deleted";
  visibility: "public" | "private";
  meta?: string[];
  pages?: string[];
  allowedUsers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetSpellbookSuccessResponse {
  data: {
    spellbook: Spellbook;
  };
  errors?: never;
}

export interface GetSpellbookErrorResponse {
  errors: GraphQLError[];
  data: {
    spellbook: null;
  };
}

export type GetSpellbookResponse =
  | GetSpellbookSuccessResponse
  | GetSpellbookErrorResponse;

export interface GetSpellbookInput {
  id: string;
}
