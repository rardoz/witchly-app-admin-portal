"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteMagicEightBallState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: DeleteMagicEightBallState | null,
  formData: FormData,
): Promise<DeleteMagicEightBallState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "ID is required",
      };
    }

    const response = await gqlRequest(
      `
      mutation HardDeleteMagicEightBallSide($id: ID!) {
        hardDeleteMagicEightBallSide(id: $id) {
          success
          message
        }
      }
      `,
      { id },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message:
          response.errors[0]?.message || "Failed to delete magic eight ball",
      };
    }

    revalidatePath("/magic-eight-ball");
    return response.data.hardDeleteMagicEightBallSide;
  } catch (error) {
    console.error("Delete magic eight ball error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
