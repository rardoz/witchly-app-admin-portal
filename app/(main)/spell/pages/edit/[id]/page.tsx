import { TbPlayCard } from "react-icons/tb";
import readSpellPageAction from "@/actions/spell/page/read";
import LinkButton from "@/components/link-button";
import SpellNav from "@/components/spell/components/nav";
import SpellPageForm from "@/components/spell/pages/components/form";
import DeleteSpellbookPageForm from "@/components/spell/pages/components/form/delete";
import { auth } from "@/lib/auth/auth";

export default async function SpellPagesEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readSpellPage = await readSpellPageAction({
    id: awaitedParams.id || "",
  }).catch((error) => {
    console.error("Failed to read spell page:", error);
    return { ...error, errors: [error] };
  });

  const hasErrors = readSpellPage.errors || !readSpellPage.data?.spellbookPage;
  const spellbookId = readSpellPage.data?.spellbookPage?.spellbook;
  return (
    <div>
      <SpellNav type="spell-pages-edit">
        <LinkButton variant="primary" href={`/spell/pages/${spellbookId}`}>
          <TbPlayCard /> Spell Pages
        </LinkButton>
        {spellbookId && (
          <DeleteSpellbookPageForm
            id={awaitedParams.id}
            spellbookId={spellbookId}
          />
        )}
      </SpellNav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load spell page</p>}
        {!hasErrors && (
          <SpellPageForm spellPageData={readSpellPage.data?.spellbookPage} />
        )}
      </div>
    </div>
  );
}
