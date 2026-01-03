"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import { popTarotCardReadCache } from "../read";

export interface UpdateTarotCardState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateTarotCardState | null,
  formData: FormData,
): Promise<UpdateTarotCardState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Tarot Card ID is required",
      };
    }

    // Filter out 'id' and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key]) => key !== "id" && !key.startsWith("$ACTION_"),
      ),
    );

    const response = await gqlRequest(
      `
        mutation UpdateTarotCard($id: ID!, $input: UpdateTarotCardInput!) {
            updateTarotCard(id: $id, input: $input) {
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
                        name
                    }
                    tarotDeck {
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
        message: response.errors[0]?.message || "Failed to update tarot card",
      };
    }

    revalidatePath(`/tarot/cards/edit/${id}`);
    revalidatePath(
      `/tarot/cards/${response.data.updateTarotCard.card.tarotDeck?._id}`,
    );
    await popTarotCardReadCache(id);

    return {
      success: true,
      message: "Tarot Card updated successfully!",
    };
  } catch (error) {
    console.error("Update tarot card error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
