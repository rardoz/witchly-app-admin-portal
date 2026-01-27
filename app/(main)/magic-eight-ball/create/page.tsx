import MagicEightBallForm from "@/components/magic-eight-ball/components/form";
import MagicEightBallNav from "@/components/magic-eight-ball/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function MagicEightBallCreate() {
  await auth();

  return (
    <div>
      <MagicEightBallNav type="magic-eight-ball-create" />
      <div className="mt-6">
        <MagicEightBallForm />
      </div>
    </div>
  );
}
