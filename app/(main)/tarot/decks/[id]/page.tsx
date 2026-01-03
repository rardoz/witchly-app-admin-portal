import { FaEye } from "react-icons/fa6";
import readTarotCardsAction from "@/actions/tarot/cards/read";
import readTarotDeckAction from "@/actions/tarot/deck/read";
import LinkButton from "@/components/link-button";
import TarotNav from "@/components/tarot/components/nav";
import TarotDeckForm from "@/components/tarot/decks/components/form";
import DeleteTarotDeckForm from "@/components/tarot/decks/components/form/delete";
import { auth } from "@/lib/auth/auth";

export default async function TarotDecksEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readTarotDeck = await readTarotDeckAction({
    id: awaitedParams.id,
  }).catch((error) => {
    console.error("Failed to read tarot deck:", error);
    return { errors: [error] };
  });

  const readTarotCards = await readTarotCardsAction({
    tarotDeckId: awaitedParams.id,
    status: "active",
  }).catch((error) => {
    console.error("Failed to read tarot cards:", error);
    return { errors: [error], data: { tarotCards: null } };
  });

  const hasErrors = readTarotDeck.errors || !readTarotDeck.data?.tarotDeck;
  return (
    <div>
      <TarotNav type="tarot-decks-edit">
        <LinkButton variant="success" href={`/tarot/cards/${awaitedParams.id}`}>
          <FaEye /> Tarot Cards
        </LinkButton>
        <DeleteTarotDeckForm id={awaitedParams.id} />
      </TarotNav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load tarot deck</p>}
        {!hasErrors && (
          <TarotDeckForm
            tarotDeckData={readTarotDeck.data?.tarotDeck}
            tarotCardsData={readTarotCards?.data?.tarotCards || undefined}
          />
        )}
      </div>
    </div>
  );
}
