"use client";
import Image from "next/image";
import Link from "next/link";
import type { GetMagicEightBallsResponse } from "@/types/magic-eight-balls";
import Card from "../card";
import CardImage from "../card/card-image";

const MagicEightBallsComponent = ({
  magicEightBallResponse,
}: {
  magicEightBallResponse: GetMagicEightBallsResponse;
}) => {
  const magicEightBalls = magicEightBallResponse.data?.magicEightBallSides;
  const hasErrors =
    magicEightBallResponse.errors ||
    !magicEightBallResponse.data?.magicEightBallSides;
  const noMagicEightBallsFound =
    !hasErrors && magicEightBalls?.totalCount === 0;

  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load magicEightBalls</p>}
      {noMagicEightBallsFound && <p>No magicEightBalls found</p>}
      <div className="grid grid-cols-2 gap-10">
        {magicEightBalls?.records?.map((magicEightBall) => (
          <div key={magicEightBall._id} className="">
            <Link
              href={`/magic-eight-ball/${magicEightBall._id}`}
              className="cursor-pointer flex h-full"
            >
              <Card>
                {
                  <CardImage
                    fill
                    width={600}
                    height={200}
                    imageContainerClassName="h-78"
                    imageClassName="object-cover"
                    primaryColor={magicEightBall.primaryColor}
                    src={
                      magicEightBall.backgroundAsset?.publicUrl &&
                      (magicEightBall.backgroundAsset?.publicUrl?.includes(
                        ".gif",
                      )
                        ? magicEightBall.backgroundAsset?.publicUrl
                        : `${magicEightBall.backgroundAsset?.publicUrl}?w=600&q=100` ||
                          "")
                    }
                    alt={magicEightBall.name || ""}
                    unoptimized
                  />
                }
                {magicEightBall.primaryAsset?.publicUrl && (
                  <Image
                    src={
                      magicEightBall.primaryAsset?.publicUrl &&
                      (magicEightBall.primaryAsset?.publicUrl?.includes(".gif")
                        ? magicEightBall.primaryAsset?.publicUrl
                        : `${magicEightBall.primaryAsset?.publicUrl}?w=200&q=100` ||
                          "")
                    }
                    alt={magicEightBall.name || ""}
                    width={100}
                    height={100}
                    unoptimized
                    className="object-cover -mt-14 mx-auto -mb-7 z-1 border border-white rounded-full w-[100px] h-[100px]"
                    style={{ borderColor: magicEightBall.primaryColor }}
                  />
                )}
                <div className="ml-2 mt-5">
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Name:</strong> {magicEightBall.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Dice Number:</strong> {magicEightBall.diceNumber}
                  </p>
                  <p className="mt-1  text-sm text-gray-500">
                    <strong>Locale:</strong> {magicEightBall.locale}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Status:</strong> {magicEightBall.status}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Created on:</strong> {magicEightBall.createdAt}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Updated on:</strong> {magicEightBall.updatedAt}
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagicEightBallsComponent;
