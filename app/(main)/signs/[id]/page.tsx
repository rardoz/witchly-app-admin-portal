import readSignAction from "@/actions/sign/read";
import SignForm from "@/components/signs/components/form";
import DeleteSignForm from "@/components/signs/components/form/delete";
import Nav from "@/components/signs/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function SignEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readSign = await readSignAction({
    id: awaitedParams.id,
  }).catch((error) => {
    console.error("Failed to read sign:", error);
    return { errors: [error] };
  });
  const hasErrors = readSign.errors || !readSign.data?.getHoroscopeSign;
  return (
    <div>
      <Nav type="signs-edit">
        <DeleteSignForm id={awaitedParams.id} />
      </Nav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load sign</p>}
        {!hasErrors && <SignForm signData={readSign.data?.getHoroscopeSign} />}
      </div>
    </div>
  );
}
