"use server";

import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetSpellbookPagesInput,
  GetSpellbookPagesResponse,
} from "@/types/spellbook-pages";

const getCacheKey = (params: string) => `spell-pages-${params}`;

export default async (
  input: GetSpellbookPagesInput,
): Promise<GetSpellbookPagesResponse> => {
  const cacheKey = getCacheKey(JSON.stringify(input));
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetSpellbookPages($spellbookId: ID!, $status: String, $visibility: String, $limit: Int, $offset: Int) {
            spellbookPages(spellbookId: $spellbookId, status: $status, visibility: $visibility, limit: $limit, offset: $offset) {
                records {
                    id
                    title
                    shortDescription
                    richText
                    user {
                        id
                        name
                        handle
                    }
                    spellbook
                    primaryAsset { id, publicUrl }
                    backgroundAsset { id, publicUrl }
                    primaryColor
                    textColor
                    backgroundColor
                    font
                    status
                    visibility
                    meta
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
      return response as GetSpellbookPagesResponse;
    },
    [cacheKey],
    {
      revalidate: 60,
      tags: [cacheKey],
    },
  );
  return await cachedFetch();
};
