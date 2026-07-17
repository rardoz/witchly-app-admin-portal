"use server";

import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetSpellbooksInput,
  GetSpellbooksResponse,
} from "@/types/spellbooks";

const getCacheKey = (params: string) => `spell-books-${params}`;

export default async (
  input: GetSpellbooksInput,
): Promise<GetSpellbooksResponse> => {
  const cacheKey = getCacheKey(JSON.stringify(input));
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetSpellbooks($status: String, $visibility: String, $limit: Int, $offset: Int) {
            spellbooks(status: $status, visibility: $visibility, limit: $limit, offset: $offset) {
                records {
                    id
                    title
                    description
                    user {
                        id
                        name
                        handle
                    }
                    primaryAsset { id, publicUrl }
                    backgroundAsset { id, publicUrl }
                    primaryColor
                    textColor
                    font
                    status
                    visibility
                    meta
                    pages
                    createdAt
                    updatedAt
                }
                totalCount
                limit
                offset
            }
        }
      `,
        input,
      );
      return response as GetSpellbooksResponse;
    },
    [cacheKey],
    {
      revalidate: 60,
      tags: [cacheKey],
    },
  );
  return await cachedFetch();
};
