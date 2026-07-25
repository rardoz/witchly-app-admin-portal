"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteSpellbookPageState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  spellbookId?: string;
}

export default async (
  _prevState: DeleteSpellbookPageState | null,
  formData: FormData,
): Promise<DeleteSpellbookPageState> => {
  try {
    const id = formData.get("id") as string;
    const spellbookId = formData.get("spellbookId") as string;

    if (!id) {
      return {
        success: false,
        message: "Spellbook page ID is required",
      };
    }

    const response = await gqlRequest(
      `
       mutation HardDeleteSpellbookPage($id: ID!) {
            hardDeleteSpellbookPage(id: $id) {
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
          response.errors[0]?.message || "Failed to delete spellbook page",
      };
    }

    if (spellbookId) {
      revalidatePath(`/spell/pages/${spellbookId}`);
    }

    return {
      ...response.data.hardDeleteSpellbookPage,
      spellbookId,
    };
  } catch (error) {
    console.error("Delete spellbook page error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
