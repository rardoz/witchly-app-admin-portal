"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type { GetUserInput, GetUserResponse } from "@/types/user";

const getCacheKey = (userId: string) => `user-${userId}`;
export const popUserReadCache = async (userId: string) => {
  revalidateTag(getCacheKey(userId));
};

export default async (input: GetUserInput): Promise<GetUserResponse> => {
  // Call API to send login code
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetUser($id: ID!) {
            user(id: $id) {
                id
                name
                email
                handle
                allowedScopes
                emailVerified
                lastLoginAt
                createdAt
                updatedAt
                profileAsset { id, publicUrl }
                bio
                shortBio
                backdropAsset { id, publicUrl }
                instagramHandle
                tikTokHandle
                twitterHandle
                websiteUrl
                facebookUrl
                snapchatHandle
                primaryColor
                sign
                sex
                location
                birthDate
                pronouns
            }
        }
      `,
        { id: input.id },
      );
      return response as GetUserResponse;
    },
    [cacheKey], // Unique cache key per user
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
