import readUserAction from "@/actions/user/read";
import ProfileForm from "@/components/profile/form";
import DeleteUserForm from "@/components/profile/form/delete";
import UsersNav from "@/components/users/components/users-nav";
import { auth } from "@/lib/auth/auth";

export default async function UsersEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readUser = await readUserAction({ id: awaitedParams.id || "" }).catch(
    (error) => {
      console.error("Failed to read user:", error);
      return { errors: [error] };
    },
  );

  const hasErrors = readUser.errors || !readUser.data?.user;
  return (
    <div>
      <UsersNav type="users-edit">
        <DeleteUserForm id={awaitedParams.id} />
      </UsersNav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load user profile</p>}
        {!hasErrors && <ProfileForm userData={readUser.data.user} />}
      </div>
    </div>
  );
}
