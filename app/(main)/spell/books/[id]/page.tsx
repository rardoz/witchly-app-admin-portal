import { FaEye } from "react-icons/fa6";
import readSpellBookAction from "@/actions/spell/book/read";
import readSpellPagesAction from "@/actions/spell/pages/read";
import LinkButton from "@/components/link-button";
import SpellBookForm from "@/components/spell/books/components/form";
import DeleteSpellBookForm from "@/components/spell/books/components/form/delete";
import SpellNav from "@/components/spell/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function SpellBooksEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readSpellBook = await readSpellBookAction({
    id: awaitedParams.id,
  }).catch((error) => {
    console.error("Failed to read spell book:", error);
    return { errors: [error] };
  });

  const readSpellPages = await readSpellPagesAction({
    spellbookId: awaitedParams.id,
    status: "active",
  }).catch((error) => {
    console.error("Failed to read spell pages:", error);
    return { errors: [error], data: { spellbookPages: null } };
  });

  const hasErrors = readSpellBook.errors || !readSpellBook.data?.spellbook;
  return (
    <div>
      <SpellNav type="spell-books-edit">
        <LinkButton variant="success" href={`/spell/pages/${awaitedParams.id}`}>
          <FaEye /> Spell Pages
        </LinkButton>
        <DeleteSpellBookForm id={awaitedParams.id} />
      </SpellNav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load spell book</p>}
        {!hasErrors && (
          <SpellBookForm
            spellBookData={readSpellBook.data?.spellbook}
            spellPagesData={readSpellPages?.data?.spellbookPages || undefined}
          />
        )}
      </div>
    </div>
  );
}
