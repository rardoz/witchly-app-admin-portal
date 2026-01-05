"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteMoonPhaseState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: DeleteMoonPhaseState | null,
  formData: FormData,
): Promise<DeleteMoonPhaseState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Moon phase ID is required",
      };
    }

    const response = await gqlRequest(
      `
        mutation HardDeleteMoonPhase($id: ID!) {
          hardDeleteMoonPhase(id: $id) {
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
        message: response.errors[0]?.message || "Failed to delete moon phase",
      };
    }

    revalidatePath("/moon-phases");
    return response.data.hardDeleteMoonPhase;
  } catch (error) {
    console.error("Delete moon phase error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
