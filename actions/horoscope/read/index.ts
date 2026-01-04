"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetHoroscopeInput,
  GetHoroscopeResponse,
} from "@/types/horoscope";

const getCacheKey = (horoscopeId: string) => `horoscope-${horoscopeId}`;
export const popHoroscopeReadCache = async (horoscopeId: string) => {
  revalidateTag(getCacheKey(horoscopeId));
};

export default async (
  input: GetHoroscopeInput,
): Promise<GetHoroscopeResponse> => {
  const cacheKey = getCacheKey(input.id);
  const session = await auth();
  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
          query GetHoroscope($id: ID!) {
              horoscope(id: $id) {
                  _id
                  sign
                  status
                  locale
                  horoscopeDate
                  horoscopeText
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
      return response as GetHoroscopeResponse;
    },
    [cacheKey], // Unique cache key per horoscope
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
