"use client";
import Link from "next/link";
import type { GetSignsResponse } from "@/types/signs";
import Card from "../card";
import CardImage from "../card/card-image";

const SignsComponent = ({
  signResponse,
}: {
  signResponse: GetSignsResponse;
}) => {
  const signs = signResponse.data?.getHoroscopeSigns;
  const hasErrors =
    signResponse.errors || !signResponse.data?.getHoroscopeSigns;
  const noSignsFound = !hasErrors && signs?.totalCount === 0;

  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load signs</p>}
      {noSignsFound && <p>No signs found</p>}
      <div className="grid grid-cols-2 gap-10">
        {signs?.records?.map((sign) => (
          <div key={sign._id} className="">
            <Link
              href={`/signs/${sign._id}`}
              className="cursor-pointer flex h-full"
            >
              <Card>
                {
                  <CardImage
                    fill={false}
                    width={400}
                    height={200}
                    src={
                      sign.asset?.publicUrl &&
                      (sign.asset?.publicUrl?.includes(".gif")
                        ? sign.asset?.publicUrl
                        : `${sign.asset?.publicUrl}?w=400&h=200&q=100` || "")
                    }
                    alt={sign.title}
                    unoptimized
                  />
                }
                <div className="ml-2 mt-5">
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Title:</strong> {sign.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Sign:</strong> {sign.sign}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Translation:</strong> {sign.signLocal}
                  </p>
                  <p className="mt-1  text-sm text-gray-500">
                    <strong>Locale:</strong> {sign.locale}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Status:</strong> {sign.status}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Created on:</strong> {sign.createdAt}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Updated on:</strong> {sign.updatedAt}
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

export default SignsComponent;
