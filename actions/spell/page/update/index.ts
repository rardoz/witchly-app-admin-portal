"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import { popSpellbookPageReadCache } from "../read";

export interface UpdateSpellbookPageState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateSpellbookPageState | null,
  formData: FormData,
): Promise<UpdateSpellbookPageState> => {
  try {
    const id = formData.get("id") as string;
    const spellbookId = formData.get("spellbook") as string;

    if (!id) {
      return {
        success: false,
        message: "Spellbook page ID is required",
      };
    }

    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key]) =>
          key !== "id" && key !== "spellbook" && !key.startsWith("$ACTION_"),
      ),
    );

    const response = await gqlRequest(
      `
        mutation UpdateSpellbookPage($id: ID!, $input: UpdateSpellbookPageInput!) {
            updateSpellbookPage(id: $id, input: $input) {
                success
                message
                spellbookPage {
                    id
                    title
                    status
                    visibility
                    updatedAt
                }
            }
        }
      `,
      { id, input },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message:
          response.errors[0]?.message || "Failed to update spellbook page",
      };
    }

    if (spellbookId) {
      revalidatePath(`/spell/pages/${spellbookId}`);
    }
    await popSpellbookPageReadCache(id);

    return {
      success: true,
      message: "Spellbook page updated successfully!",
    };
  } catch (error) {
    console.error("Update spellbook page error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
