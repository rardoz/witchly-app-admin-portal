"use client";
import Link from "next/link";
import type { GetSpellbookPagesResponse } from "@/types/spellbook-pages";

const SpellPagesComponent = ({
  spellbookPagesResponse,
}: {
  spellbookPagesResponse: GetSpellbookPagesResponse;
}) => {
  const spellbookPages = spellbookPagesResponse.data?.spellbookPages;
  const hasErrors =
    spellbookPagesResponse.errors ||
    !spellbookPagesResponse.data?.spellbookPages;
  const noPagesFound = !hasErrors && spellbookPages?.totalCount === 0;
  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load spell pages</p>}
      {noPagesFound && <p>No spell pages found</p>}
      <div className="grid grid-cols-2 gap-4">
        {spellbookPages?.records?.map((page) => (
          <div key={page.id} className="mt-6">
            <Link
              href={`/spell/pages/edit/${page.id}`}
              className="cursor-pointer relative text-left flex bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {page.primaryAsset?.publicUrl && (
                <div
                  className="mr-4 shrink-0 w-16 h-20 bg-zinc-800 rounded overflow-hidden"
                  style={{ borderColor: page.primaryColor, borderWidth: 2 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.primaryAsset.publicUrl}
                    alt="spell page asset"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="ml-2">
                <p className="text-sm font-semibold text-white">{page.title}</p>
                {page.shortDescription && (
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                    {page.shortDescription}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Status:</strong> {page.status}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Visibility:</strong> {page.visibility}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Created on:</strong> {page.createdAt}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellPagesComponent;
