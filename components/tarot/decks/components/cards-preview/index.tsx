import Image from "next/image";
import Link from "next/link";
import { FaEye, FaPlus } from "react-icons/fa6";
import FormLabel from "@/components/form/form-label";
import {
  CARD_PREVIEW_HEIGHT,
  CARD_PREVIEW_WIDTH,
} from "@/components/tarot/constants";
import type { TarotCardsData } from "@/types/tarot-cards";

const CardsPrevew = ({
  tarotDeckId,
  tarotCardsData,
  primaryColor,
}: {
  tarotDeckId?: string;
  tarotCardsData?: TarotCardsData;
  primaryColor?: string;
}) => {
  return !tarotCardsData ? null : (
    <>
      <div
        style={{
          width: `${CARD_PREVIEW_WIDTH}px`,
          minWidth: `${CARD_PREVIEW_WIDTH}px`,
        }}
      >
        <Link
          href={`/tarot/cards/${tarotDeckId}/create`}
          className={`bg-purple-900/20 w-full relative cursor-pointer border-2 border-white block mt-6`}
          style={{
            borderColor: primaryColor,
            height: `${CARD_PREVIEW_HEIGHT}px`,
          }}
        >
          <div className="flex items-center justify-center h-full w-full">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <FaPlus /> Add a new card
            </span>
          </div>
        </Link>
      </div>
      {tarotCardsData?.records?.map((card) => (
        <div
          key={card._id}
          style={{
            width: `${CARD_PREVIEW_WIDTH}px`,
            minWidth: `${CARD_PREVIEW_WIDTH}px`,
          }}
        >
          <FormLabel className="text-sm font-medium text-gray-700 capitalize flex items-center gap-2 ">
            <span className="block text-ellipsis overflow-hidden whitespace-nowrap">
              {card.tarotCardNumber || card.name || "Tarot Card Preview"}
            </span>
            {card.primaryAsset?.publicUrl && (
              <Link target="_blank" href={card.primaryAsset?.publicUrl}>
                <FaEye />
              </Link>
            )}
          </FormLabel>
          <Link
            href={`/tarot/cards/edit/${card._id}`}
            className={`bg-purple-900/20 w-full relative cursor-pointer border-2 border-white block`}
            style={{
              borderColor: primaryColor,
              height: `${CARD_PREVIEW_HEIGHT}px`,
            }}
          >
            <Image
              src={
                `${card.primaryAsset?.publicUrl}`.includes(".gif")
                  ? `${card.primaryAsset?.publicUrl}`
                  : `${card.primaryAsset?.publicUrl}?w=250&h=400&q=100` || ""
              }
              alt="Card Preview"
              fill
              unoptimized
              className="absolute inset-0 z-1 h-full w-full object-cover"
            />
          </Link>
        </div>
      ))}
      {tarotCardsData?.totalCount !== tarotCardsData?.records?.length && (
        <div
          style={{
            width: `${CARD_PREVIEW_WIDTH}px`,
            minWidth: `${CARD_PREVIEW_WIDTH}px`,
          }}
        >
          <Link
            href={`/tarot/cards/${tarotDeckId}?offset=${tarotCardsData?.offset + tarotCardsData?.limit}`}
            className={`bg-purple-900/20 w-full relative cursor-pointer border-2 border-white block mt-6`}
            style={{
              borderColor: primaryColor,
              height: `${CARD_PREVIEW_HEIGHT}px`,
            }}
          >
            <div className="flex items-center justify-center h-full w-full">
              <span className="text-sm font-medium text-white flex items-center gap-2">
                <FaPlus />{" "}
                {tarotCardsData?.totalCount - tarotCardsData?.records?.length}{" "}
                more cards
              </span>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default CardsPrevew;
