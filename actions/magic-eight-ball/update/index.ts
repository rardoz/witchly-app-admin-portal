"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import { popMagicEightBallReadCache } from "../read";

export interface UpdateMagicEightBallState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateMagicEightBallState | null,
  formData: FormData,
): Promise<UpdateMagicEightBallState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "ID is required",
      };
    }

    // Filter out 'id' and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key]) => key !== "id" && !key.startsWith("$ACTION_"),
      ),
    );

    if (input.diceNumber) {
      input.diceNumber = Number(input.diceNumber);
    }
    const response = await gqlRequest(
      `
      mutation UpdateMagicEightBallSide($id: ID!, $input: UpdateMagicEightBallInput!) {
        updateMagicEightBallSide(id: $id, input: $input) {
          success
          message
        }
      }
      `,
      {
        id,
        input,
      },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message:
          response.errors[0]?.message || "Failed to update magic eight ball",
      };
    }

    revalidatePath("/magic-eight-ball");
    await popMagicEightBallReadCache(id);
    return response.data.updateMagicEightBallSide;
  } catch (error) {
    console.error("Update magic eight ball error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
