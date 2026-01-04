"use server";

import dayjs from "dayjs";
import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { gqlRequestWithAuth } from "@/lib/gql";
import type {
  GetHoroscopesInput,
  GetHoroscopesResponse,
} from "@/types/horoscopes";

const getCacheKey = (params: string) => `horoscope-${params}`;

export default async (
  input: GetHoroscopesInput,
): Promise<GetHoroscopesResponse> => {
  // Call API to send login code
  const cacheKey = getCacheKey(JSON.stringify(input));
  const session = await auth();
  const horoscopeDate = input.horoscopeDate
    ? dayjs(input.horoscopeDate).format("YYYY-MM-DDT00:00:00.000[Z]")
    : undefined;

  const cachedFetch = unstable_cache(
    async () => {
      const response = await gqlRequestWithAuth(
        session,
        `
        query GetHoroscopes($sign: String, $status: String, $locale: String, $horoscopeDate: DateTimeISO, $limit: Int, $offset: Int) {
          horoscopes(sign: $sign, status: $status, locale: $locale, horoscopeDate: $horoscopeDate, limit: $limit, offset: $offset) {
                records {
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
                totalCount
                limit
                offset
            }
        }
      `,
        { ...input, horoscopeDate },
      );
      return response as GetHoroscopesResponse;
    },
    [cacheKey], // Unique cache key per page and filters
    {
      revalidate: 60, // Cache for 1 minute
      tags: [cacheKey], // Tag for on-demand revalidation
    },
  );
  return await cachedFetch();
};
