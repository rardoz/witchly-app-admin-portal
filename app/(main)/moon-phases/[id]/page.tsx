import readMoonPhaseAction from "@/actions/moon-phase/read";
import MoonPhaseForm from "@/components/moon-phases/components/form";
import DeleteMoonPhaseForm from "@/components/moon-phases/components/form/delete";
import Nav from "@/components/moon-phases/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function MoonPhaseEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readMoonPhase = await readMoonPhaseAction({
    id: awaitedParams.id,
  }).catch((error) => {
    console.error("Failed to read moonPhase:", error);
    return { errors: [error] };
  });
  const hasErrors = readMoonPhase.errors || !readMoonPhase.data?.moonPhase;
  return (
    <div>
      <Nav type="moon-phases-edit">
        <DeleteMoonPhaseForm id={awaitedParams.id} />
      </Nav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load moonPhase</p>}
        {!hasErrors && (
          <MoonPhaseForm moonPhaseData={readMoonPhase.data?.moonPhase} />
        )}
      </div>
    </div>
  );
}
