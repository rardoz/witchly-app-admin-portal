import SpellBookForm from "@/components/spell/books/components/form";
import SpellNav from "@/components/spell/components/nav";
import { auth } from "@/lib/auth/auth";

export default async function SpellBooksCreate() {
  await auth();

  return (
    <div>
      <SpellNav type="spell-books-create" />
      <div className="mt-6">
        <SpellBookForm />
      </div>
    </div>
  );
}
