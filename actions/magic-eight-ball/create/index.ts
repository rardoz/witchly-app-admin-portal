"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
export interface CreateMagicEightBallState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
}

export default async (
  _prevState: CreateMagicEightBallState | null,
  formData: FormData,
): Promise<CreateMagicEightBallState> => {
  try {
    // Filter out "" and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
      ),
    );

    const response = await gqlRequest(
      `
        mutation CreateMagicEightBallSide($input: CreateMagicEightBallInput!) {
          createMagicEightBallSide(input: $input) {
            success
            message
            side {
              _id
            }
          }
        }
      `,
      {
        input: { ...input, diceNumber: Number(input.diceNumber) },
      },
      false,
    );
    if (response.errors) {
      return {
        success: false,
        message:
          response.errors[0]?.message || "Failed to create magic eight ball",
      };
    }

    revalidatePath("/magic-eight-ball");
    return {
      success: response.data.createMagicEightBallSide.success,
      message: response.data.createMagicEightBallSide.message,
      id: response.data.createMagicEightBallSide.side._id,
    };
  } catch (error) {
    console.error("Create magic eight ball error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
