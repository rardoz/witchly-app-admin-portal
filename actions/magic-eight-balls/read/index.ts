"use server";

import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetMagicEightBallsInput,
  GetMagicEightBallsResponse,
} from "@/types/magic-eight-balls";

const getCacheKey = (params: string) => `magic-eight-balls-${params}`;

export default async (
  input: GetMagicEightBallsInput,
): Promise<GetMagicEightBallsResponse> => {
  // Call API to send login code

  const cacheKey = getCacheKey(JSON.stringify(input));
  const session = await auth();

  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetMagicEightBallSides($locale: String, $status: String, $limit: Int, $offset: Int, $diceNumber: Int) {
          magicEightBallSides(locale: $locale, status: $status, limit: $limit, offset: $offset, diceNumber: $diceNumber) {
            records {
                _id
                name
                locale
                description
                diceNumber
                primaryColor
                status
                primaryAsset   {
                    id
                    publicUrl
                }
                backgroundAsset   {
                    id
                    publicUrl
                }
                user {
                  id
                  handle
                  name
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
      return response as GetMagicEightBallsResponse;
    },
    [cacheKey], // Unique cache key per page and filters
    {
      revalidate: 60, // Cache for 1 minute
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
