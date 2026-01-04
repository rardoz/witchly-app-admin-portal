import HoroscopeForm from "@/components/horoscopes/components/form";
import HoroscopesNav from "@/components/horoscopes/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function HoroscopesCreate() {
  await auth();

  return (
    <div>
      <HoroscopesNav type="horoscopes-create" />
      <div className="mt-6">
        <HoroscopeForm />
      </div>
    </div>
  );
}
