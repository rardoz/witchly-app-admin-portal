import { TbPlayCard } from "react-icons/tb";
import readTarotCardAction from "@/actions/tarot/card/read";
import LinkButton from "@/components/link-button";
import TarotCardForm from "@/components/tarot/cards/components/form";
import DeleteTarotCardForm from "@/components/tarot/cards/components/form/delete";
import TarotNav from "@/components/tarot/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function TarotCardsEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readTarotCard = await readTarotCardAction({
    id: awaitedParams.id || "",
  }).catch((error) => {
    console.error("Failed to read tarot card:", error);
    return { ...error, errors: [error] };
  });

  const hasErrors = readTarotCard.errors || !readTarotCard.data?.tarotCard;
  const tarotDeckId = readTarotCard.data?.tarotCard?.tarotDeck?._id;
  return (
    <div>
      <TarotNav type="tarot-cards-edit">
        <LinkButton variant="primary" href={`/tarot/cards/${tarotDeckId}`}>
          <TbPlayCard /> Tarot Cards
        </LinkButton>
        {tarotDeckId && (
          <DeleteTarotCardForm
            id={awaitedParams.id}
            tarotDeckId={tarotDeckId}
          />
        )}
      </TarotNav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load tarot card</p>}
        {!hasErrors && (
          <TarotCardForm tarotCardData={readTarotCard.data?.tarotCard} />
        )}
      </div>
    </div>
  );
}
