"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteUserState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: DeleteUserState | null,
  formData: FormData,
): Promise<DeleteUserState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "User ID is required",
      };
    }

    const response = await gqlRequest(
      `
        mutation DeleteUser( $id: ID! ) {
            deleteUser(id: $id)
        }
      `,
      { id },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to delete user profile",
      };
    }

    revalidatePath("/users");

    return {
      success: true,
      message: "User deleted successfully!",
    };
  } catch (error) {
    console.error("Delete user error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
