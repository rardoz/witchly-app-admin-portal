import TarotDecksNav from "@/components/tarot/components/nav";
import TarotDeckForm from "@/components/tarot/decks/components/form";
import { auth } from "@/lib/auth/auth";

export default async function TarotDecksCreate() {
  await auth();

  return (
    <div>
      <TarotDecksNav type="tarot-decks-create" />
      <div className="mt-6">
        <TarotDeckForm />
      </div>
    </div>
  );
}
