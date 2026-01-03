"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteTarotCardState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: DeleteTarotCardState | null,
  formData: FormData,
): Promise<DeleteTarotCardState> => {
  try {
    const id = formData.get("id") as string;
    const tarotDeckID = formData.get("tarotDeckId") as string;

    if (!id) {
      return {
        success: false,
        message: "Tarot Card ID is required",
      };
    }
    if (!tarotDeckID) {
      return {
        success: false,
        message: "Tarot Deck ID is required",
      };
    }

    const response = await gqlRequest(
      `
       mutation HardDeleteTarotCard($id: ID!) {
            hardDeleteTarotCard(id: $id) {
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
        message: response.errors[0]?.message || "Failed to delete tarot card",
      };
    }

    revalidatePath(`/tarot/cards/${tarotDeckID}`);
    return response.data.hardDeleteTarotCard;
  } catch (error) {
    console.error("Delete tarot card error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
