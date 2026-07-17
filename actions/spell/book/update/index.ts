"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import { popSpellbookReadCache } from "../read";

export interface UpdateSpellbookState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateSpellbookState | null,
  formData: FormData,
): Promise<UpdateSpellbookState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Spellbook ID is required",
      };
    }

    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key]) => key !== "id" && !key.startsWith("$ACTION_"),
      ),
    );

    const response = await gqlRequest(
      `
        mutation UpdateSpellbook($id: ID!, $input: UpdateSpellbookInput!) {
            updateSpellbook(id: $id, input: $input) {
                success
                message
                spellbook {
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
        message: response.errors[0]?.message || "Failed to update spellbook",
      };
    }

    revalidatePath("/spell/books");
    await popSpellbookReadCache(id);

    return {
      success: true,
      message: "Spellbook updated successfully!",
    };
  } catch (error) {
    console.error("Update spellbook error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
