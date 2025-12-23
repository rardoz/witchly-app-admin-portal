import { FaPenToSquare } from "react-icons/fa6";
import readUserAction from "@/actions/user/read";
import PageTitle from "@/components/page-title";
import ProfileForm from "@/components/profile/form";
import { auth } from "@/lib/auth/auth";

export default async function Profile() {
  const session = await auth();
  const readUser = await readUserAction({ id: session?.user.id || "" });
  const hasErrors = readUser.errors || !readUser.data?.user;
  return (
    <div>
      <PageTitle>
        <FaPenToSquare />
        Edit Profile
      </PageTitle>

      <div className="mt-6">
        {hasErrors && <p>Failed to load user profile</p>}
        {!hasErrors && <ProfileForm userData={readUser.data.user} />}
      </div>
    </div>
  );
}
