"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type { GetUsersInput, GetUsersResponse } from "@/types/users";

const getCacheKey = (userId: string) => `user-${userId}`;
export const popUserReadCache = async (userId: string) => {
  revalidateTag(getCacheKey(userId));
};

export default async (input: GetUsersInput): Promise<GetUsersResponse> => {
  // Call API to send login code
  const cacheKey = getCacheKey(
    JSON.stringify({ limit: input.limit, offset: input.offset }),
  );
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetUsers($limit: Float, $offset: Float){
          users(limit: $limit, offset: $offset) {
            records {
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
              totalCount 
            }
        }
      `,
        input,
      );
      return response as GetUsersResponse;
    },
    [cacheKey], // Unique cache key per page and filters
    {
      revalidate: 60, // Cache for 1 minute
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
