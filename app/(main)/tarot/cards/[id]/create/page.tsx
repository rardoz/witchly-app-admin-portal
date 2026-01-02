import { TbPlayCard } from "react-icons/tb";
import LinkButton from "@/components/link-button";
import TarotCardForm from "@/components/tarot/cards/components/form";
import TarotNav from "@/components/tarot/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function TarotCardsCreate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const tarotDeckID = awaitedParams.id;

  return (
    <div>
      <TarotNav type="tarot-card-create">
        <LinkButton href={`/tarot/cards/${tarotDeckID}`}>
          <TbPlayCard /> All Tarot Cards
        </LinkButton>
      </TarotNav>
      <div className="mt-6">
        <TarotCardForm tarotDeckId={tarotDeckID} />
      </div>
    </div>
  );
}
