"use server";

import { revalidatePath } from "next/cache";
import { sanitizeMeta } from "@/actions/helpers";
import gqlRequest from "@/lib/gql";

export interface CreateSpellbookState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
}

export default async (
  _prevState: CreateSpellbookState | null,
  formData: FormData,
): Promise<CreateSpellbookState> => {
  try {
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
      ),
    );

    if (input.meta) {
      input.meta = sanitizeMeta(input.meta as string | string[]);
    }

    const response = await gqlRequest(
      `
      mutation CreateSpellbook($input: CreateSpellbookInput!) {
        createSpellbook(input: $input) {
          success
          message
          spellbook {
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
        message: response.errors[0]?.message || "Failed to create spellbook",
      };
    }

    revalidatePath("/spell/books");

    return {
      success: true,
      message: "Spellbook created successfully!",
      id: response.data.createSpellbook.spellbook.id,
    };
  } catch (error) {
    console.error("Create spellbook error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
