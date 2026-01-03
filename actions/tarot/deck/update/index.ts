"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import { popTarotDeckReadCache } from "../read";

export interface UpdateTarotDeckState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateTarotDeckState | null,
  formData: FormData,
): Promise<UpdateTarotDeckState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Tarot Deck ID is required",
      };
    }

    // Filter out 'id' and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key]) => key !== "id" && !key.startsWith("$ACTION_"),
      ),
    );

    if (!Number.isNaN(input.layoutCount)) {
      input.layoutCount = Number(input.layoutCount);
    }

    console.log(input, Array.from(formData.entries()));

    const response = await gqlRequest(
      `
        mutation UpdateTarotDeck($id: ID!, $input: UpdateTarotDeckInput!) {
            updateTarotDeck(id: $id, input: $input) {
                success
                message
                deck {
                    _id
                    name
                    locale
                    user {
                        id
                        handle
                        name
                    }
                    primaryAsset { id, publicUrl }
                    cardBackgroundAsset { id, publicUrl }
                    primaryColor
                    description
                    author
                    meta
                    layoutType
                    layoutCount
                    status
                    createdAt
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
        message: response.errors[0]?.message || "Failed to update tarot deck",
      };
    }

    revalidatePath("/tarot/decks");
    await popTarotDeckReadCache(id);

    return {
      success: true,
      message: "Tarot Deck updated successfully!",
    };
  } catch (error) {
    console.error("Update tarot deck error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
