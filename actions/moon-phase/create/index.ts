"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import phaseToNumber from "../phase-to-number";
export interface CreateMoonPhaseState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
}

export default async (
  _prevState: CreateMoonPhaseState | null,
  formData: FormData,
): Promise<CreateMoonPhaseState> => {
  try {
    // Filter out "" and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
      ),
    );

    const response = await gqlRequest(
      `
        mutation CreateMoonPhase($input: CreateMoonPhaseInput!) {
          createMoonPhase(input: $input) {
            success
            message
            moonPhase {
              _id
            }
          }
        }
      `,
      {
        input: { ...input, number: phaseToNumber(input.phase as string) },
      },
      false,
    );
    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to create moon phase",
      };
    }

    revalidatePath("/moon-phases");
    return {
      success: response.data.createMoonPhase.success,
      message: response.data.createMoonPhase.message,
      id: response.data.createMoonPhase.moonPhase._id,
    };
  } catch (error) {
    console.error("Create moon phase error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
