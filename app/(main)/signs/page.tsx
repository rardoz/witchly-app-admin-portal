import readSignsAction from "@/actions/signs/read";
import Pagination from "@/components/pagination";
import SignsComponent from "@/components/signs";
import SignsFilters from "@/components/signs/components/filters";
import SignsNav from "@/components/signs/components/nav";
import { auth } from "@/lib/auth/auth";

interface SignsSearchParams {
  locale?: string;
  sign?: string;
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function Signs({
  searchParams,
}: {
  searchParams: Promise<SignsSearchParams & PaginationParams>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: SignsSearchParams = {};
  if (awaitedSearchParams.locale) filters.locale = awaitedSearchParams.locale;

  if (awaitedSearchParams.sign) filters.sign = awaitedSearchParams.sign;

  const readSigns = await readSignsAction({ limit, offset, ...filters }).catch(
    (error) => {
      console.error("Failed to read signs:", error);
      return { errors: [error], data: { getHoroscopeSigns: null } };
    },
  );

  return (
    <div>
      <SignsNav />
      <SignsFilters />
      <SignsComponent signResponse={readSigns} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readSigns.data?.getHoroscopeSigns?.totalCount || 0}
      />
    </div>
  );
}
