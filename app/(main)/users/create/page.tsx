import ProfileForm from "@/components/profile/form";
import UsersNav from "@/components/users/components/users-nav";
import { auth } from "@/lib/auth/auth";

export default async function UsersCreate() {
  await auth();

  return (
    <div>
      <UsersNav type="users-create" />
      <div className="mt-6">
        <ProfileForm />
      </div>
    </div>
  );
}
