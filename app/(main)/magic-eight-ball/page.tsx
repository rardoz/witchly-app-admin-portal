import readMagicEightBallAction from "@/actions/magic-eight-balls/read";
import MagicEightBallComponent from "@/components/magic-eight-ball";
import MagicEightBallFilters from "@/components/magic-eight-ball/components/filters";
import MagicEightBallNav from "@/components/magic-eight-ball/components/nav";
import Pagination from "@/components/pagination";
import { auth } from "@/lib/auth/auth";
import type { MagicEightBall as MagicEightBallType } from "@/types/magic-eight-ball";

interface MagicEightBallSearchParams {
  locale?: string;
  phase?: string;
  status?: MagicEightBallType["status"];
  diceNumber?: number;
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function MagicEightBall({
  searchParams,
}: {
  searchParams: Promise<MagicEightBallSearchParams & PaginationParams>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: MagicEightBallSearchParams = {};
  if (awaitedSearchParams.locale) filters.locale = awaitedSearchParams.locale;

  if (awaitedSearchParams.phase) filters.phase = awaitedSearchParams.phase;

  if (awaitedSearchParams.status) filters.status = awaitedSearchParams.status;

  if (awaitedSearchParams.diceNumber)
    filters.diceNumber = parseInt(awaitedSearchParams.diceNumber, 10);

  const readMagicEightBall = await readMagicEightBallAction({
    limit,
    offset,
    ...filters,
  }).catch((error) => {
    console.error("Failed to read magic eight ball:", error);
    return { errors: [error], data: { magicEightBallSides: null } };
  });

  return (
    <div>
      <MagicEightBallNav />
      <MagicEightBallFilters />
      <MagicEightBallComponent magicEightBallResponse={readMagicEightBall} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readMagicEightBall.data?.magicEightBallSides?.totalCount || 0}
      />
    </div>
  );
}
