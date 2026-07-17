"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface CreateSpellbookPageState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
  spellbookId?: string;
}

export default async (
  _prevState: CreateSpellbookPageState | null,
  formData: FormData,
): Promise<CreateSpellbookPageState> => {
  try {
    const spellbookId = formData.get("spellbook") as string;

    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
      ),
    );

    const response = await gqlRequest(
      `
      mutation CreateSpellbookPage($input: CreateSpellbookPageInput!) {
        createSpellbookPage(input: $input) {
          success
          message
          spellbookPage {
            id
            title
            status
            visibility
            createdAt
            updatedAt
          }
        }
      }
      `,
      { input },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message:
          response.errors[0]?.message || "Failed to create spellbook page",
      };
    }

    revalidatePath(`/spell/pages/${spellbookId}`);

    return {
      success: true,
      message: "Spellbook page created successfully!",
      id: response.data.createSpellbookPage.spellbookPage.id,
      spellbookId,
    };
  } catch (error) {
    console.error("Create spellbook page error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
