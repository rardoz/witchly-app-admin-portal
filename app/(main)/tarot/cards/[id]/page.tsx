import { FaEye, FaPlus } from "react-icons/fa6";
import { TbPlayCard } from "react-icons/tb";
import readTarotCardsAction from "@/actions/tarot/cards/read";
import LinkButton from "@/components/link-button";
import Pagination from "@/components/pagination";
import TarotCardsComponent from "@/components/tarot/cards";
import TarotCardsFilters from "@/components/tarot/cards/components/filters";
import TarotNav from "@/components/tarot/components/nav";
import { auth } from "@/lib/auth/auth";

interface TarotCardsSearchParams {
  status?: "active" | "paused" | "deleted";
  locale?: string;
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function TarotDecks({
  searchParams,
  params,
}: {
  searchParams: Promise<TarotCardsSearchParams & PaginationParams>;
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const awaitedParams = await params;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const tarotDeckID = awaitedParams.id;
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: TarotCardsSearchParams = {};
  if (awaitedSearchParams.status) filters.status = awaitedSearchParams.status;

  const readTarot = await readTarotCardsAction({
    tarotDeckId: tarotDeckID,
    limit,
    offset,
    ...filters,
  }).catch((error) => {
    console.error("Failed to read tarot cards:", error);
    return { errors: [error], data: { tarotCards: null } };
  });

  return (
    <div>
      <TarotNav type="tarot-cards-all">
        <LinkButton href={`/tarot/decks/${tarotDeckID}`}>
          <FaEye /> View Tarot Deck
        </LinkButton>
        <LinkButton
          variant="success"
          href={`/tarot/cards/${tarotDeckID}/create`}
        >
          <FaPlus /> Create Tarot Card
        </LinkButton>
      </TarotNav>
      <TarotCardsFilters />
      <TarotCardsComponent tarotCardsResponse={readTarot} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readTarot.data?.tarotCards?.totalCount || 0}
      />
    </div>
  );
}
