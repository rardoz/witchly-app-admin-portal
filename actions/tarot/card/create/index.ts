"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface CreateTarotCardState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
}

export default async (
  _prevState: CreateTarotCardState | null,
  formData: FormData,
): Promise<CreateTarotCardState> => {
  try {
    // Filter out "" and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
      ),
    );

    if (!input.tarotDeck) {
      return {
        success: false,
        message: "Tarot deck ID is required",
      };
    }

    const response = await gqlRequest(
      `
        mutation CreateTarotCard($input: CreateTarotCardInput!) {
            createTarotCard(input: $input) {
                success
                message
                card {
                    _id
                    name
                    tarotCardNumber
                    primaryAsset {
                        id
                        publicUrl
                    }
                    description
                    locale
                    meta
                    status
                    user {
                        id
                        handle
                    }
                    tarotDeck {
                        _id
                        name
                    }
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
        message: response.errors[0]?.message || "Failed to create tarot card",
      };
    }

    revalidatePath(`/tarot/cards/${input.tarotDeck}`);
    return {
      success: true,
      message: "Tarot card created successfully!",
      id: response.data.createTarotCard.card._id,
    };
  } catch (error) {
    console.error("Create tarot card error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
