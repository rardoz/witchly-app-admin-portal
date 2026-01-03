"use server";

import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetTarotCardsInput,
  GetTarotCardsResponse,
} from "@/types/tarot-cards";

const getCacheKey = (params: string) => `tarot-cards-${params}`;

export default async (
  input: GetTarotCardsInput,
): Promise<GetTarotCardsResponse> => {
  // Call API to send login code
  const cacheKey = getCacheKey(JSON.stringify(input));
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
          query GetTarotCards($tarotDeckId: ID!, $status: String, $limit: Int, $offset: Int) {
            tarotCards(tarotDeckId: $tarotDeckId, status: $status, limit: $limit, offset: $offset) {
                records {
                    _id
                    name
                    tarotCardNumber
                    primaryAsset { id, publicUrl }
                    description
                    locale
                    meta
                    status
                    user {
                        id
                        handle
                    }
                    tarotDeck {
                      _id
                        name
                        locale
                        user {
                            id
                            handle
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
                totalCount
                limit
                offset
            }
        }
      `,
        input,
      );
      return response as GetTarotCardsResponse;
    },
    [cacheKey], // Unique cache key per page and filters
    {
      revalidate: 60, // Cache for 1 minute
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
