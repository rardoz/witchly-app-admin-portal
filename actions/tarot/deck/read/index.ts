"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetTarotDeckInput,
  GetTarotDeckResponse,
} from "@/types/tarot-deck";

const getCacheKey = (tarotDeckId: string) => `tarot-deck-${tarotDeckId}`;
export const popTarotDeckReadCache = async (tarotDeckId: string) => {
  revalidateTag(getCacheKey(tarotDeckId));
};

export default async (
  input: GetTarotDeckInput,
): Promise<GetTarotDeckResponse> => {
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
          query GetTarotDeck($id: ID!) {
            tarotDeck(id: $id) {
                _id
                name
                locale
                user {
                    id
                    handle
                    name
                }
                primaryAsset { id, publicUrl }
                cardBackgroundAsset { id, publicUrl }
                primaryColor
                description
                author
                meta
                layoutType
                layoutCount
                status
                createdAt
                updatedAt
            }
        }
      `,
        { id: input.id },
      );
      return response as GetTarotDeckResponse;
    },
    [cacheKey], // Unique cache key per tarot deck
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
