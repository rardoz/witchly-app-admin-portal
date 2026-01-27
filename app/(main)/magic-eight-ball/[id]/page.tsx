import readMagicEightBallAction from "@/actions/magic-eight-ball/read";
import MagicEightBallForm from "@/components/magic-eight-ball/components/form";
import DeleteMagicEightBallForm from "@/components/magic-eight-ball/components/form/delete";
import Nav from "@/components/magic-eight-ball/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function MagicEightBallEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readMagicEightBall = await readMagicEightBallAction({
    id: awaitedParams.id,
  }).catch((error) => {
    console.error("Failed to read magicEightBall:", error);
    return { errors: [error] };
  });
  const hasErrors =
    readMagicEightBall.errors || !readMagicEightBall.data?.magicEightBallSide;
  return (
    <div>
      <Nav type="magic-eight-ball-edit">
        <DeleteMagicEightBallForm id={awaitedParams.id} />
      </Nav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load magicEightBall</p>}
        {!hasErrors && (
          <MagicEightBallForm
            magicEightBallData={readMagicEightBall.data?.magicEightBallSide}
          />
        )}
      </div>
    </div>
  );
}
