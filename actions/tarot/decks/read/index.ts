"use server";

import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetTarotDecksInput,
  GetTarotDecksResponse,
} from "@/types/tarot-decks";

const getCacheKey = (params: string) => `tarot-decks-${params}`;

export default async (
  input: GetTarotDecksInput,
): Promise<GetTarotDecksResponse> => {
  // Call API to send login code
  const cacheKey = getCacheKey(JSON.stringify(input));
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetTarotDecks($status: String, $locale: String, $limit: Int, $offset: Int) {
            tarotDecks(status: $status, locale: $locale, limit: $limit, offset: $offset) {
                records {
                    _id
                    name
                    locale
                    user {
                        id
                        name
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
                totalCount
                limit
                offset
            }
        }
      `,
        input,
      );
      return response as GetTarotDecksResponse;
    },
    [cacheKey], // Unique cache key per page and filters
    {
      revalidate: 60, // Cache for 1 minute
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
