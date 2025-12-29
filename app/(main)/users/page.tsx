import readUsersAction from "@/actions/users/read";
import Pagination from "@/components/pagination";
import UsersComponent from "@/components/users";
import UsersNav from "@/components/users/components/all-users-nav";
import UsersFilters from "@/components/users/components/filters";
import { auth } from "@/lib/auth/auth";

interface UsersSearchParams {
  email?: string;
  name?: string;
  handle?: string;
  access?: "admin" | "basic" | "denied";
}

interface PaginationParams {
  limit?: string;
  offset?: string;
}

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<UsersSearchParams & PaginationParams>;
}) {
  await auth();
  const awaitedSearchParams = await searchParams;
  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const filters: UsersSearchParams = {};
  if (awaitedSearchParams.email) filters.email = awaitedSearchParams.email;

  if (awaitedSearchParams.name) filters.name = awaitedSearchParams.name;

  if (awaitedSearchParams.handle) filters.handle = awaitedSearchParams.handle;

  if (awaitedSearchParams.access) filters.access = awaitedSearchParams.access;

  const readUser = await readUsersAction({ limit, offset, ...filters }).catch(
    (error) => {
      console.error("Failed to read user:", error);
      return { errors: [error], data: { users: null } };
    },
  );

  return (
    <div>
      <UsersNav />
      <UsersFilters />
      <UsersComponent userResponse={readUser} />
      <Pagination
        limit={limit}
        offset={offset}
        total={readUser.data?.users?.totalCount || 0}
      />
    </div>
  );
}
