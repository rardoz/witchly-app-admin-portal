"use client";
import Link from "next/link";
import type { GetHoroscopesResponse } from "@/types/horoscopes";
import Card from "../card";

const HoroscopesComponent = ({
  horoscopeResponse,
}: {
  horoscopeResponse: GetHoroscopesResponse;
}) => {
  const horoscopes = horoscopeResponse.data?.horoscopes;
  const hasErrors =
    horoscopeResponse.errors || !horoscopeResponse.data?.horoscopes;
  const noHoroscopesFound = !hasErrors && horoscopes?.totalCount === 0;

  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load horoscopes</p>}
      {noHoroscopesFound && <p>No horoscopes found</p>}
      <div className="grid grid-cols-2 gap-10">
        {horoscopes?.records?.map((horoscope) => (
          <div key={horoscope._id} className="">
            <Link
              href={`/horoscopes/${horoscope._id}`}
              className="cursor-pointer flex h-full"
            >
              <Card>
                <div className="ml-2 my-2">
                  <p className="text-sm mb-4 border-b pb-3 border-gray-600 text-gray-500">
                    <strong>Horoscope:</strong>
                    <br />
                    {horoscope.horoscopeText}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Sign:</strong> {horoscope.sign}
                  </p>
                  <p className="mt-1  text-sm text-gray-500">
                    <strong>Locale:</strong> {horoscope.locale}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Status:</strong> {horoscope.status}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Updated by:</strong>{" "}
                    {horoscope.user.name || horoscope.user.handle}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Horoscope date:</strong> {horoscope.horoscopeDate}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Created on:</strong> {horoscope.createdAt}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Updated on:</strong> {horoscope.updatedAt}
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

export default HoroscopesComponent;
