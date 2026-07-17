"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetSpellbookPageInput,
  GetSpellbookPageResponse,
} from "@/types/spellbook-page";

const getCacheKey = (spellbookPageId: string) =>
  `spell-page-${spellbookPageId}`;

export const popSpellbookPageReadCache = async (spellbookPageId: string) => {
  revalidateTag(getCacheKey(spellbookPageId));
};

export default async (
  input: GetSpellbookPageInput,
): Promise<GetSpellbookPageResponse> => {
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
          query GetSpellbookPage($id: ID!) {
            spellbookPage(id: $id) {
                id
                title
                shortDescription
                richText
                user {
                    id
                    handle
                    name
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
        }
      `,
        { id: input.id },
      );
      return response as GetSpellbookPageResponse;
    },
    [cacheKey],
    {
      revalidate: 3600,
      tags: [cacheKey],
    },
  );
  return await cachedFetch();
};
