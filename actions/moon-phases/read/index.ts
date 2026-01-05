"use server";

import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetMoonPhasesInput,
  GetMoonPhasesResponse,
} from "@/types/moon-phases";

const getCacheKey = (params: string) => `moon-phases-${params}`;

export default async (
  input: GetMoonPhasesInput,
): Promise<GetMoonPhasesResponse> => {
  // Call API to send login code
  const cacheKey = getCacheKey(JSON.stringify(input));
  const session = await auth();

  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetMoonPhases($locale: String, $status: String, $phase: String, $limit: Float, $offset: Float) {
          moonPhases(locale: $locale, status: $status, phase: $phase, limit: $limit, offset: $offset) {
            records {
                _id
                phase
                phaseLocal
                locale
                description
                number
                primaryColor
                status
                primaryAsset {
                    id
                    publicUrl
                }
                backgroundAsset {
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
      return response as GetMoonPhasesResponse;
    },
    [cacheKey], // Unique cache key per page and filters
    {
      revalidate: 60, // Cache for 1 minute
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
