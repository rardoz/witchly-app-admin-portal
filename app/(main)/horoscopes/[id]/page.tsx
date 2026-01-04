import readHoroscopeAction from "@/actions/horoscope/read";
import HoroscopeForm from "@/components/horoscopes/components/form";
import DeleteHoroscopeForm from "@/components/horoscopes/components/form/delete";
import Nav from "@/components/horoscopes/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function HoroscopeEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth();
  const awaitedParams = await params;
  const readHoroscope = await readHoroscopeAction({
    id: awaitedParams.id,
  }).catch((error) => {
    console.error("Failed to read horoscope:", error);
    return { errors: [error] };
  });
  const hasErrors = readHoroscope.errors || !readHoroscope.data?.horoscope;
  return (
    <div>
      <Nav type="horoscopes-edit">
        <DeleteHoroscopeForm id={awaitedParams.id} />
      </Nav>

      <div className="mt-6">
        {hasErrors && <p>Failed to load horoscope</p>}
        {!hasErrors && (
          <HoroscopeForm horoscopeData={readHoroscope.data?.horoscope} />
        )}
      </div>
    </div>
  );
}
