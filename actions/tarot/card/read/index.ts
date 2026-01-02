"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetTarotCardInput,
  GetTarotCardResponse,
} from "@/types/tarot-card";

const getCacheKey = (tarotCardId: string) => `tarot-card-${tarotCardId}`;
export const popTarotCardReadCache = async (tarotCardId: string) => {
  revalidateTag(getCacheKey(tarotCardId));
};

export default async (
  input: GetTarotCardInput,
): Promise<GetTarotCardResponse> => {
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
          query GetTarotCard($id: ID!) {
            tarotCard(id: $id) {
                _id
                name
                tarotCardNumber
                primaryAsset {
                    id
                    publicUrl
                }
                description
                locale
                meta
                status
                user {
                    id
                    handle
                    name
                }
                tarotDeck {
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
                createdAt
                updatedAt
            }
        }
      `,
        { id: input.id },
      );
      return response as GetTarotCardResponse;
    },
    [cacheKey], // Unique cache key per tarot card
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
