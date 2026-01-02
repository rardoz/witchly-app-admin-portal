import { FaEye } from "react-icons/fa6";
import readTarotDeckAction from "@/actions/tarot/deck/read";
import LinkButton from "@/components/link-button";
import TarotNav from "@/components/tarot/components/nav";
import TarotDeckForm from "@/components/tarot/decks/components/form";
import DeleteTarotDeckForm from "@/components/tarot/decks/components/form/delete";
import { auth } from "@/lib/auth/auth";

export default async function TarotCardsEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  //   const readTarotDeck = await readTarotDeckAction({
  //     id: awaitedParams.id || "",
  //   }).catch((error) => {
  //     console.error("Failed to read tarot deck:", error);
  //     return { errors: [error] };
  //   });

  //const hasErrors = readTarotDeck.errors || !readTarotDeck.data?.tarotDeck;
  return (
    <div>
      {/* <TarotNav type="tarot-decks-cards">
        <LinkButton variant="success" href="/tarot/decks/[id]/cards">
          <FaEye /> Deck Cards
        </LinkButton>
        <DeleteTarotDeckForm id={awaitedParams.id} />
      </TarotNav> */}

      <div className="mt-6">
        todo
        {/* {hasErrors && <p>Failed to load tarot deck</p>}
        {!hasErrors && (
          <TarotDeckForm tarotDeckData={readTarotDeck.data?.tarotDeck} />
        )} */}
      </div>
    </div>
  );
}
