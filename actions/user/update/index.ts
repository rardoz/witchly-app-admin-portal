"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import { popUserReadCache } from "../read";

export interface UpdateUserState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateUserState | null,
  formData: FormData,
): Promise<UpdateUserState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "User ID is required",
      };
    }

    // Filter out 'id' and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) =>
          key !== "id" && !key.startsWith("$ACTION_") && value !== "",
      ),
    );

    if (input.access) {
      if (input.access === "admin") {
        input.allowedScopes = ["read", "write", "admin"];
      } else if (input.access === "basic") {
        input.allowedScopes = ["read", "write", "basic"];
      } else if (input.access === "denied") {
        input.allowedScopes = ["read"];
      }
      delete input.access;
    }

    const response = await gqlRequest(
      `
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
              id
              name
              email
              handle
              allowedScopes
              emailVerified
              updatedAt
              profileAsset { id, publicUrl }
              bio
              shortBio
              backdropAsset { id, publicUrl }
              instagramHandle
              tikTokHandle
              twitterHandle
              websiteUrl
              facebookUrl
              snapchatHandle
              primaryColor
              sign
              sex
              location
              birthDate
              pronouns
            }
        }
      `,
      { id, input },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to update user profile",
      };
    }

    revalidatePath("/users");
    await popUserReadCache(id);

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
