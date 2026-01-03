"use client";
import Image from "next/image";
import Link from "next/link";
import type { GetTarotDecksResponse } from "@/types/tarot-decks";
import { CARD_THUMBNAIL_HEIGHT, CARD_THUMBNAIL_WIDTH } from "../constants";

const TarotDecksComponent = ({
  tarotDecksResponse,
}: {
  tarotDecksResponse: GetTarotDecksResponse;
}) => {
  const tarotDecks = tarotDecksResponse.data?.tarotDecks;
  const hasErrors =
    tarotDecksResponse.errors || !tarotDecksResponse.data?.tarotDecks;
  const noTarotDecksFound = !hasErrors && tarotDecks?.totalCount === 0;
  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load tarot decks</p>}
      {noTarotDecksFound && <p>No tarot decks found</p>}
      <div className="grid grid-cols-2 gap-4">
        {tarotDecks?.records?.map((deck) => (
          <div key={deck._id} className="mt-6">
            <Link
              href={`/tarot/decks/${deck._id}`}
              className="cursor-pointer relative text-left flex"
            >
              {/* Card flip container */}
              <div
                className="mr-2 relative group"
                style={{
                  width: `${CARD_THUMBNAIL_WIDTH}px`,
                  height: `${CARD_THUMBNAIL_HEIGHT}px`,
                  perspective: "1000px",
                }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front face - Primary Asset */}
                  <div
                    className="absolute inset-0 bg-purple-900 overflow-hidden border-2 border-white shadow backface-hidden"
                    style={{
                      borderColor: deck.primaryColor,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <small className="absolute top-1/3 left-0 z-0 text-center w-full px-2">
                      Click to edit {deck.name}
                    </small>
                    {deck.primaryAsset?.publicUrl && (
                      <Image
                        src={
                          deck.primaryAsset?.publicUrl?.includes(".gif")
                            ? deck.primaryAsset?.publicUrl
                            : `${deck.primaryAsset?.publicUrl}?w=200&h=300&q=100` ||
                              ""
                        }
                        alt="tarot deck asset"
                        fill
                        unoptimized
                        className="absolute inset-0 h-full w-full object-cover z-1"
                      />
                    )}
                  </div>

                  {/* Back face - Card Background Asset */}
                  <div
                    className="absolute inset-0 bg-purple-900 overflow-hidden border-2 border-white shadow rotate-y-180"
                    style={{
                      borderColor: deck.primaryColor,
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {deck.cardBackgroundAsset?.publicUrl && (
                      <Image
                        src={
                          deck.cardBackgroundAsset?.publicUrl?.includes(".gif")
                            ? deck.cardBackgroundAsset?.publicUrl
                            : `${deck.cardBackgroundAsset?.publicUrl}?w=200&h=300&q=100` ||
                              ""
                        }
                        alt="tarot deck card back asset"
                        fill
                        unoptimized
                        className="absolute inset-0 h-full w-full object-cover z-1"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="ml-2">
                <p className="text-sm text-gray-500">
                  <strong>Name:</strong> {deck.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Locale:</strong> {deck.locale}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Status:</strong> {deck.status}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Author:</strong>{" "}
                  {deck.author || deck.user?.name || deck.user?.handle}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Metadata:</strong> {deck.meta?.join(", ")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Created on:</strong> {deck.createdAt}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Updated on:</strong> {deck.updatedAt}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TarotDecksComponent;
