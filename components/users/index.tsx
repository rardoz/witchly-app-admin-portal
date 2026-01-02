"use client";
import Image from "next/image";
import Link from "next/link";
import type { GetUsersResponse } from "@/types/users";

const UsersComponent = ({
  userResponse,
}: {
  userResponse: GetUsersResponse;
}) => {
  const users = userResponse.data?.users;
  const hasErrors = userResponse.errors || !userResponse.data?.users;
  const noUsersFound = !hasErrors && users?.totalCount === 0;
  return (
    <div className="mt-6 mb-8 pb-8 border-b border-foreground/10">
      {hasErrors && <p>Failed to load user users</p>}
      {noUsersFound && <p>No users found</p>}
      <div className="grid grid-cols-2 gap-4">
        {users?.records?.map((user) => (
          <div key={user.id} className="mt-6 ">
            <Link
              href={`/users/${user.id}`}
              className="cursor-pointer relative text-left flex"
            >
              <div
                className="w-28 h-28 mr-2 bg-purple-900 relative rounded-full overflow-hidden border-2 border-white shadow z-1"
                style={
                  user.primaryColor ? { borderColor: user.primaryColor } : {}
                }
              >
                <small className="absolute top-1/3 left-0 z-0 text-center">
                  Click to edit {user.handle}
                </small>
                {user.profileAsset?.publicUrl && (
                  <Image
                    src={
                      user.profileAsset?.publicUrl?.includes(".gif")
                        ? user.profileAsset?.publicUrl
                        : `${user.profileAsset?.publicUrl}?w=300&h=300&q=100` ||
                          ""
                    }
                    alt="click to upload avatar"
                    fill
                    unoptimized
                    className="absolute inset-0 h-full w-full object-cover z-1"
                  />
                )}
              </div>
              <div className="ml-2">
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Handle:</strong> {user.handle}
                </p>
                <p className="mt-1  text-sm text-gray-500">
                  <strong>Allowed scopes:</strong>{" "}
                  {user.allowedScopes.join(", ")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Created on:</strong> {user.createdAt}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Updated on:</strong> {user.updatedAt}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersComponent;
