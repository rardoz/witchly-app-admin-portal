import readSpellBooksAction from "@/actions/spell/books/read";
import Pagination from "@/components/pagination";
import SpellBooksComponent from "@/components/spell/books";
import SpellBooksFilters from "@/components/spell/books/components/filters";
import SpellNav from "@/components/spell/components/nav";
import { auth } from "@/lib/auth/auth";

interface SpellBooksSearchParams {
  status?: "active" | "pending" | "deleted";
  visibility?: "public" | "private";
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function SpellBooks({
  searchParams,
}: {
  searchParams: Promise<SpellBooksSearchParams & PaginationParams>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: SpellBooksSearchParams = {};
  if (awaitedSearchParams.status) filters.status = awaitedSearchParams.status;
  if (awaitedSearchParams.visibility)
    filters.visibility = awaitedSearchParams.visibility;

  const readSpellBooks = await readSpellBooksAction({
    limit,
    offset,
    ...filters,
  }).catch((error) => {
    console.error("Failed to read spell books:", error);
    return { errors: [error], data: { spellbooks: null } };
  });

  return (
    <div>
      <SpellNav />
      <SpellBooksFilters />
      <SpellBooksComponent spellbooksResponse={readSpellBooks} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readSpellBooks.data?.spellbooks?.totalCount || 0}
      />
    </div>
  );
}
