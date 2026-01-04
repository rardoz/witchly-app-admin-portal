import SignForm from "@/components/signs/components/form";
import SignsNav from "@/components/signs/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function SignsCreate() {
  await auth();

  return (
    <div>
      <SignsNav type="signs-create" />
      <div className="mt-6">
        <SignForm />
      </div>
    </div>
  );
}
