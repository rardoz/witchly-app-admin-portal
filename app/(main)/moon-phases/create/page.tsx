import MoonPhaseForm from "@/components/moon-phases/components/form";
import MoonPhasesNav from "@/components/moon-phases/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function MoonPhasesCreate() {
  await auth();

  return (
    <div>
      <MoonPhasesNav type="moon-phases-create" />
      <div className="mt-6">
        <MoonPhaseForm />
      </div>
    </div>
  );
}
