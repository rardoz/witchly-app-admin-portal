"use client";
import Image from "next/image";
import Link from "next/link";
import type { GetMoonPhasesResponse } from "@/types/moon-phases";
import Card from "../card";
import CardImage from "../card/card-image";

const MoonPhasesComponent = ({
  moonPhaseResponse,
}: {
  moonPhaseResponse: GetMoonPhasesResponse;
}) => {
  const moonPhases = moonPhaseResponse.data?.moonPhases;
  const hasErrors =
    moonPhaseResponse.errors || !moonPhaseResponse.data?.moonPhases;
  const noMoonPhasesFound = !hasErrors && moonPhases?.totalCount === 0;

  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load moonPhases</p>}
      {noMoonPhasesFound && <p>No moonPhases found</p>}
      <div className="grid grid-cols-2 gap-10">
        {moonPhases?.records?.map((moonPhase) => (
          <div key={moonPhase._id} className="">
            <Link
              href={`/moon-phases/${moonPhase._id}`}
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
                    primaryColor={moonPhase.primaryColor}
                    src={
                      moonPhase.backgroundAsset?.publicUrl &&
                      (moonPhase.backgroundAsset?.publicUrl?.includes(".gif")
                        ? moonPhase.backgroundAsset?.publicUrl
                        : `${moonPhase.backgroundAsset?.publicUrl}?w=600&q=100` ||
                          "")
                    }
                    alt={moonPhase.phaseLocal}
                    unoptimized
                  />
                }
                {moonPhase.primaryAsset?.publicUrl && (
                  <Image
                    src={
                      moonPhase.primaryAsset?.publicUrl &&
                      (moonPhase.primaryAsset?.publicUrl?.includes(".gif")
                        ? moonPhase.primaryAsset?.publicUrl
                        : `${moonPhase.primaryAsset?.publicUrl}?w=200&q=100` ||
                          "")
                    }
                    alt={moonPhase.phaseLocal}
                    width={100}
                    height={100}
                    unoptimized
                    className="object-cover -mt-14 mx-auto -mb-7 z-1 border border-white rounded-full"
                    style={{ borderColor: moonPhase.primaryColor }}
                  />
                )}
                <div className="ml-2 mt-5">
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Phase Local:</strong> {moonPhase.phaseLocal}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Phase:</strong> {moonPhase.phase}
                  </p>
                  <p className="mt-1  text-sm text-gray-500">
                    <strong>Locale:</strong> {moonPhase.locale}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Status:</strong> {moonPhase.status}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Created on:</strong> {moonPhase.createdAt}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Updated on:</strong> {moonPhase.updatedAt}
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

export default MoonPhasesComponent;
