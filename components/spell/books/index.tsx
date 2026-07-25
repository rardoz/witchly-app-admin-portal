"use client";
import Link from "next/link";
import type { GetSpellbooksResponse } from "@/types/spellbooks";

const SpellBooksComponent = ({
  spellbooksResponse,
}: {
  spellbooksResponse: GetSpellbooksResponse;
}) => {
  const spellbooks = spellbooksResponse.data?.spellbooks;
  const hasErrors =
    spellbooksResponse.errors || !spellbooksResponse.data?.spellbooks;
  const noBooksFound = !hasErrors && spellbooks?.totalCount === 0;
  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load spell books</p>}
      {noBooksFound && <p>No spell books found</p>}
      <div className="grid grid-cols-2 gap-4">
        {spellbooks?.records?.map((book) => (
          <div key={book.id} className="mt-6">
            <Link
              href={`/spell/books/${book.id}`}
              className="cursor-pointer relative text-left flex bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {book.primaryAsset?.publicUrl && (
                <div
                  className="mr-4 shrink-0 w-16 h-20 bg-zinc-800 rounded overflow-hidden"
                  style={{ borderColor: book.primaryColor, borderWidth: 2 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.primaryAsset.publicUrl}
                    alt="spell book cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="ml-2">
                <p className="text-sm font-semibold text-white">{book.title}</p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Status:</strong> {book.status}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Visibility:</strong> {book.visibility}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Author:</strong>{" "}
                  {book.user?.name || book.user?.handle}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Pages:</strong> {book.pages?.length || 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Created on:</strong> {book.createdAt}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellBooksComponent;
