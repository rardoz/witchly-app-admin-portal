import { FaEye, FaPlus } from "react-icons/fa6";
import readSpellPagesAction from "@/actions/spell/pages/read";
import LinkButton from "@/components/link-button";
import Pagination from "@/components/pagination";
import SpellNav from "@/components/spell/components/nav";
import SpellPagesComponent from "@/components/spell/pages";
import SpellPagesFilters from "@/components/spell/pages/components/filters";
import { auth } from "@/lib/auth/auth";

interface SpellPagesSearchParams {
  status?: "active" | "pending" | "deleted";
  visibility?: "public" | "private";
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function SpellPages({
  searchParams,
  params,
}: {
  searchParams: Promise<SpellPagesSearchParams & PaginationParams>;
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const awaitedParams = await params;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const spellbookId = awaitedParams.id;
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: SpellPagesSearchParams = {};
  if (awaitedSearchParams.status) filters.status = awaitedSearchParams.status;
  if (awaitedSearchParams.visibility)
    filters.visibility = awaitedSearchParams.visibility;

  const readSpellPages = await readSpellPagesAction({
    spellbookId,
    limit,
    offset,
    ...filters,
  }).catch((error) => {
    console.error("Failed to read spell pages:", error);
    return { errors: [error], data: { spellbookPages: null } };
  });

  return (
    <div>
      <SpellNav type="spell-pages-all">
        <LinkButton href={`/spell/books/${spellbookId}`}>
          <FaEye /> View Spell Book
        </LinkButton>
        <LinkButton
          variant="success"
          href={`/spell/pages/${spellbookId}/create`}
        >
          <FaPlus /> Create Spell Page
        </LinkButton>
      </SpellNav>
      <SpellPagesFilters />
      <SpellPagesComponent spellbookPagesResponse={readSpellPages} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readSpellPages.data?.spellbookPages?.totalCount || 0}
      />
    </div>
  );
}
