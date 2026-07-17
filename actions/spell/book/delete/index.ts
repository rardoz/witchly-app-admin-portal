"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteSpellbookState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: DeleteSpellbookState | null,
  formData: FormData,
): Promise<DeleteSpellbookState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Spellbook ID is required",
      };
    }

    const response = await gqlRequest(
      `
       mutation HardDeleteSpellbook($id: ID!) {
            hardDeleteSpellbook(id: $id) {
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
        message: response.errors[0]?.message || "Failed to delete spellbook",
      };
    }

    revalidatePath("/spell/books");

    return response.data.hardDeleteSpellbook;
  } catch (error) {
    console.error("Delete spellbook error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
