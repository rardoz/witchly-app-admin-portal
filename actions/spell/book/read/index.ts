"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetSpellbookInput,
  GetSpellbookResponse,
} from "@/types/spellbook";

const getCacheKey = (spellbookId: string) => `spell-book-${spellbookId}`;

export const popSpellbookReadCache = async (spellbookId: string) => {
  revalidateTag(getCacheKey(spellbookId));
};

export default async (
  input: GetSpellbookInput,
): Promise<GetSpellbookResponse> => {
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
          query GetSpellbook($id: ID!) {
            spellbook(id: $id) {
                id
                title
                description
                user {
                    id
                    handle
                    name
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
        }
      `,
        { id: input.id },
      );
      return response as GetSpellbookResponse;
    },
    [cacheKey],
    {
      revalidate: 3600,
      tags: [cacheKey],
    },
  );
  return await cachedFetch();
};
