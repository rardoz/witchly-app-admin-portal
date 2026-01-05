"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetMoonPhaseInput,
  GetMoonPhaseResponse,
} from "@/types/moon-phase";

const getCacheKey = (moonPhaseId: string) => `moon-phase-${moonPhaseId}`;
export const popMoonPhaseReadCache = async (moonPhaseId: string) => {
  revalidateTag(getCacheKey(moonPhaseId));
};

export default async (
  input: GetMoonPhaseInput,
): Promise<GetMoonPhaseResponse> => {
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetMoonPhase($id: ID!) {
          moonPhase(id: $id) {
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
        }
        `,
        { id: input.id },
      );
      return response as GetMoonPhaseResponse;
    },
    [cacheKey], // Unique cache key per moon phase
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
