"use client";
import Image from "next/image";
import Link from "next/link";
import type { GetTarotCardsResponse } from "@/types/tarot-cards";
import { CARD_THUMBNAIL_HEIGHT, CARD_THUMBNAIL_WIDTH } from "../constants";

const TarotCardsComponent = ({
  tarotCardsResponse,
}: {
  tarotCardsResponse: GetTarotCardsResponse;
}) => {
  const tarotCards = tarotCardsResponse.data?.tarotCards;
  const hasErrors =
    tarotCardsResponse.errors || !tarotCardsResponse.data?.tarotCards;
  const noTarotCardsFound = !hasErrors && tarotCards?.totalCount === 0;
  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load tarot cards</p>}
      {noTarotCardsFound && <p>No tarot cards found</p>}
      <div className="grid grid-cols-2 gap-4">
        {tarotCards?.records?.map((card) => (
          <div key={card._id} className="mt-6">
            <Link
              href={`/tarot/cards/edit/${card._id}`}
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
                      borderColor: card.tarotDeck.primaryColor,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <small className="absolute top-1/3 left-0 z-0 text-center w-full px-2">
                      Click to edit {card.name}
                    </small>
                    {card.primaryAsset?.publicUrl && (
                      <Image
                        src={
                          card.primaryAsset?.publicUrl?.includes(".gif")
                            ? card.primaryAsset?.publicUrl
                            : `${card.primaryAsset?.publicUrl}?w=200&h=300&q=100` ||
                              ""
                        }
                        alt="tarot card asset"
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
                      borderColor: card.tarotDeck.primaryColor,
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {card.tarotDeck.cardBackgroundAsset?.publicUrl && (
                      <Image
                        src={
                          card.tarotDeck.cardBackgroundAsset?.publicUrl?.includes(
                            ".gif",
                          )
                            ? card.tarotDeck.cardBackgroundAsset?.publicUrl
                            : `${card.tarotDeck.cardBackgroundAsset?.publicUrl}?w=200&h=300&q=100` ||
                              ""
                        }
                        alt="tarot card back asset"
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
                  <strong>Name:</strong> {card.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Locale:</strong> {card.tarotDeck.locale}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Status:</strong> {card.status}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Author:</strong>{" "}
                  {card.tarotDeck.author ||
                    card.tarotDeck.user?.name ||
                    card.tarotDeck.user?.handle}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Metadata:</strong> {card.meta?.join(", ")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Created on:</strong> {card.createdAt}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Updated on:</strong> {card.updatedAt}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TarotCardsComponent;
