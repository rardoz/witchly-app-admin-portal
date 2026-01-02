"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface CreateUserState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
}

export default async (
  _prevState: CreateUserState | null,
  formData: FormData,
): Promise<CreateUserState> => {
  try {
    // Filter out "" and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
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
    //seed data
    // for (let i = 0; i < 50; i++) {
    //   await gqlRequest(
    //     `
    //     mutation CreateUser($input: CreateUserInput!) {
    //         createUser(input: $input) {
    //           id
    //           name
    //           email
    //           handle
    //           allowedScopes
    //           emailVerified
    //           updatedAt
    //           profileAsset { id, publicUrl }
    //           bio
    //           shortBio
    //           backdropAsset { id, publicUrl }
    //           instagramHandle
    //           tikTokHandle
    //           twitterHandle
    //           websiteUrl
    //           facebookUrl
    //           snapchatHandle
    //           primaryColor
    //           sign
    //           sex
    //           location
    //           birthDate
    //           pronouns
    //         }
    //     }
    //   `,
    //     {
    //       input: {
    //         ...input,
    //         handle: "fakeHandle" + Date.now(),
    //         email: "fakeEmail" + Date.now() + "@example.com",
    //         name: "Fake Name" + Date.now(),
    //       },
    //     },
    //     false
    //   );
    // }
    const response = await gqlRequest(
      `
        mutation CreateUser($input: CreateUserInput!) {
            createUser(input: $input) {
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
      { input },
      false,
    );
    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to create user",
      };
    }

    revalidatePath("/users");

    return {
      success: true,
      message: "User created successfully!",
      id: response.data.createUser.id,
    };
  } catch (error) {
    console.error("Create user error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
