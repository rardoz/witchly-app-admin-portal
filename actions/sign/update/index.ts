"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import { popSignReadCache } from "../read";
import signToDate from "../sign-to-date";

export interface UpdateSignState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateSignState | null,
  formData: FormData,
): Promise<UpdateSignState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Sign ID is required",
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
        mutation UpdateHoroscopeSign($id: ID!, $input: UpdateHoroscopeSignInput!) {
            updateHoroscopeSign(id: $id, input: $input) {
                success
                message
            }
        }
      `,
      {
        id,
        input: {
          ...input,
          ...signToDate(input.sign as string),
        },
      },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to update sign",
      };
    }

    revalidatePath("/signs");
    await popSignReadCache(id);

    return {
      success: response.data.updateHoroscopeSign.success,
      message:
        response.data.updateHoroscopeSign.message ||
        "Sign updated successfully!",
    };
  } catch (error) {
    console.error("Update sign error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
