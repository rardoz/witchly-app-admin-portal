"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetMagicEightBallInput,
  GetMagicEightBallResponse,
} from "@/types/magic-eight-ball";

const getCacheKey = (magicEightBallId: string) =>
  `magic-eight-ball-${magicEightBallId}`;
export const popMagicEightBallReadCache = async (magicEightBallId: string) => {
  revalidateTag(getCacheKey(magicEightBallId));
};

export default async (
  input: GetMagicEightBallInput,
): Promise<GetMagicEightBallResponse> => {
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetMagicEightBallSide($id: ID) {
          magicEightBallSide(id: $id) {
            _id
            name
            locale
            description
            diceNumber
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
      return response as GetMagicEightBallResponse;
    },
    [cacheKey], // Unique cache key
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
