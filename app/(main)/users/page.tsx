import readUsersAction from "@/actions/users/read";
import Pagination from "@/components/pagination";
import UsersComponent from "@/components/users";
import UsersNav from "@/components/users/components/all-users-nav";
import { auth } from "@/lib/auth/auth";

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{ limit: string; offset: string }>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const limit = parseInt(awaitedSearchParams.limit, 10) || 10;
  const offset = parseInt(awaitedSearchParams.offset, 10) || 0;
  const readUser = await readUsersAction({ limit, offset }).catch((error) => {
    console.error("Failed to read user:", error);
    return { errors: [error], data: { users: null } };
  });

  return (
    <div>
      <UsersNav />
      <UsersComponent userResponse={readUser} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readUser.data?.users?.totalCount || 0}
      />
    </div>
  );
}
