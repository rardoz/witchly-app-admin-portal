"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type { GetSignInput, GetSignResponse } from "@/types/sign";

const getCacheKey = (signId: string) => `sign-${signId}`;
export const popSignReadCache = async (signId: string) => {
  revalidateTag(getCacheKey(signId));
};

export default async (input: GetSignInput): Promise<GetSignResponse> => {
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetHoroscopeSign($id: ID!) {
            getHoroscopeSign(id: $id) {
                _id
                sign
                signLocal
                locale
                description
                signDateStart
                signDateEnd
                asset {
                    id
                    publicUrl
                }
                title
                createdAt
                updatedAt
                status
            }
        }
        `,
        { id: input.id },
      );
      return response as GetSignResponse;
    },
    [cacheKey], // Unique cache key per sign
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
