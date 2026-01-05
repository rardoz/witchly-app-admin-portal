import readMoonPhasesAction from "@/actions/moon-phases/read";
import MoonPhasesComponent from "@/components/moon-phases";
import MoonPhasesFilters from "@/components/moon-phases/components/filters";
import MoonPhasesNav from "@/components/moon-phases/components/nav";
import Pagination from "@/components/pagination";
import { auth } from "@/lib/auth/auth";

interface MoonPhasesSearchParams {
  locale?: string;
  phase?: string;
  status?: string;
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function MoonPhases({
  searchParams,
}: {
  searchParams: Promise<MoonPhasesSearchParams & PaginationParams>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: MoonPhasesSearchParams = {};
  if (awaitedSearchParams.locale) filters.locale = awaitedSearchParams.locale;

  if (awaitedSearchParams.phase) filters.phase = awaitedSearchParams.phase;

  if (awaitedSearchParams.status) filters.status = awaitedSearchParams.status;

  const readMoonPhases = await readMoonPhasesAction({
    limit,
    offset,
    ...filters,
  }).catch((error) => {
    console.error("Failed to read moon phases:", error);
    return { errors: [error], data: { moonPhases: null } };
  });

  return (
    <div>
      <MoonPhasesNav />
      <MoonPhasesFilters />
      <MoonPhasesComponent moonPhaseResponse={readMoonPhases} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readMoonPhases.data?.moonPhases?.totalCount || 0}
      />
    </div>
  );
}
