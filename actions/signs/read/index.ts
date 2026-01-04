"use server";

import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type { GetSignsInput, GetSignsResponse } from "@/types/signs";

const getCacheKey = (params: string) => `sign-${params}`;

export default async (input: GetSignsInput): Promise<GetSignsResponse> => {
  // Call API to send login code
  const cacheKey = getCacheKey(JSON.stringify(input));
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetHoroscopeSigns($locale: String, $sign: String, $limit: Int, $offset: Int) {
          getHoroscopeSigns(locale: $locale, sign: $sign, limit: $limit, offset: $offset) {
            records {
                _id
                sign
                locale
                description
                signDateStart
                signDateEnd
                asset { id, publicUrl }
                title
                createdAt
                updatedAt
              }
              totalCount 
            }
        }
      `,
        input,
      );
      return response as GetSignsResponse;
    },
    [cacheKey], // Unique cache key per page and filters
    {
      revalidate: 60, // Cache for 1 minute
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
