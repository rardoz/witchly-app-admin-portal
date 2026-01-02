"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface CreateTarotDeckState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
}

export default async (
  _prevState: CreateTarotDeckState | null,
  formData: FormData,
): Promise<CreateTarotDeckState> => {
  try {
    // Filter out "" and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
      ),
    );

    if (!Number.isNaN(input.layoutCount)) {
      input.layoutCount = Number(input.layoutCount);
    }

    const response = await gqlRequest(
      `
      mutation CreateTarotDeck($input: CreateTarotDeckInput!) {
        createTarotDeck(input: $input) {
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
      { input },
      false,
    );
    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to create tarot deck",
      };
    }

    revalidatePath("/tarot/decks");

    return {
      success: true,
      message: "Tarot deck created successfully!",
      id: response.data.createTarotDeck.deck._id,
    };
  } catch (error) {
    console.error("Create tarot deck error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
