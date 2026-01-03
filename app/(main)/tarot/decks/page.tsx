import readTarotDecksAction from "@/actions/tarot/decks/read";
import Pagination from "@/components/pagination";
import TarotNav from "@/components/tarot/components/nav";
import TarotDecksComponent from "@/components/tarot/decks";
import TarotDecksFilters from "@/components/tarot/decks/components/filters";
import { auth } from "@/lib/auth/auth";

interface TarotDecksSearchParams {
  status?: "active" | "paused" | "deleted";
  locale?: string;
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function TarotDecks({
  searchParams,
}: {
  searchParams: Promise<TarotDecksSearchParams & PaginationParams>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: TarotDecksSearchParams = {};
  if (awaitedSearchParams.status) filters.status = awaitedSearchParams.status;

  if (awaitedSearchParams.locale) filters.locale = awaitedSearchParams.locale;
  const readTarot = await readTarotDecksAction({
    limit,
    offset,
    ...filters,
  }).catch((error) => {
    console.error("Failed to read tarot:", error);
    return { errors: [error], data: { tarotDecks: null } };
  });

  return (
    <div>
      <TarotNav />
      <TarotDecksFilters />
      <TarotDecksComponent tarotDecksResponse={readTarot} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readTarot.data?.tarotDecks?.totalCount || 0}
      />
    </div>
  );
}
