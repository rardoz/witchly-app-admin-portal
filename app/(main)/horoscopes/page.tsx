import readHoroscopesAction from "@/actions/horoscopes/read";
import HoroscopesComponent from "@/components/horoscopes";
import HoroscopesFilters from "@/components/horoscopes/components/filters";
import HoroscopesNav from "@/components/horoscopes/components/nav";
import Pagination from "@/components/pagination";
import { auth } from "@/lib/auth/auth";

interface HoroscopesSearchParams {
  locale?: string;
  horoscopeDate?: string;
  status?: string;
  sign?: string;
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function Horoscopes({
  searchParams,
}: {
  searchParams: Promise<HoroscopesSearchParams & PaginationParams>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: HoroscopesSearchParams = {};
  if (awaitedSearchParams.locale) filters.locale = awaitedSearchParams.locale;

  if (awaitedSearchParams.horoscopeDate)
    filters.horoscopeDate = awaitedSearchParams.horoscopeDate;

  if (awaitedSearchParams.status) filters.status = awaitedSearchParams.status;

  if (awaitedSearchParams.sign) filters.sign = awaitedSearchParams.sign;

  const readHoroscopes = await readHoroscopesAction({
    limit,
    offset,
    ...filters,
  }).catch((error) => {
    console.error("Failed to read horoscopes:", error);
    return { errors: [error], data: { horoscopes: null } };
  });

  return (
    <div>
      <HoroscopesNav />
      <HoroscopesFilters />
      <HoroscopesComponent horoscopeResponse={readHoroscopes} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readHoroscopes.data?.horoscopes?.totalCount || 0}
      />
    </div>
  );
}
