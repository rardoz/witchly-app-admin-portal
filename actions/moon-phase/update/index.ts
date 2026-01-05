"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import phaseToNumber from "../phase-to-number";
import { popMoonPhaseReadCache } from "../read";

export interface UpdateMoonPhaseState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateMoonPhaseState | null,
  formData: FormData,
): Promise<UpdateMoonPhaseState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Moon phase ID is required",
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
      mutation UpdateMoonPhase($id: ID!, $input: UpdateMoonPhaseInput!) {
        updateMoonPhase(id: $id, input: $input) {
          success
          message
        }
      }
      `,
      {
        id,
        input: { ...input, number: phaseToNumber(input.phase as string) },
      },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to update moon phase",
      };
    }

    revalidatePath("/moon-phases");
    await popMoonPhaseReadCache(id);

    return response.data.updateMoonPhase;
  } catch (error) {
    console.error("Update moon phase error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
