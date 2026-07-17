import { TbPlayCard } from "react-icons/tb";
import LinkButton from "@/components/link-button";
import SpellNav from "@/components/spell/components/nav";
import SpellPageForm from "@/components/spell/pages/components/form";
import { auth } from "@/lib/auth/auth";

export default async function SpellPagesCreate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const spellbookId = awaitedParams.id;

  return (
    <div>
      <SpellNav type="spell-page-create">
        <LinkButton href={`/spell/pages/${spellbookId}`}>
          <TbPlayCard /> All Spell Pages
        </LinkButton>
      </SpellNav>
      <div className="mt-6">
        <SpellPageForm spellbookId={spellbookId} />
      </div>
    </div>
  );
}
