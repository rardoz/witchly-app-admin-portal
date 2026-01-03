"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteTarotDeckState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: DeleteTarotDeckState | null,
  formData: FormData,
): Promise<DeleteTarotDeckState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Tarot Deck ID is required",
      };
    }

    const response = await gqlRequest(
      `
       mutation DeleteTarotDeck($id: ID!, $hardDelete: Boolean) {
            deleteTarotDeck(id: $id, hardDelete: $hardDelete) {
                success
                message
            }
        }
      `,
      { id, hardDelete: true },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to delete tarot deck",
      };
    }

    revalidatePath("/tarot/decks");

    return response.data.deleteTarotDeck;
  } catch (error) {
    console.error("Delete tarot deck error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
