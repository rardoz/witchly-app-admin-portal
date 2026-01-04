"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteSignState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: DeleteSignState | null,
  formData: FormData,
): Promise<DeleteSignState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Sign ID is required",
      };
    }

    const response = await gqlRequest(
      `
        mutation DeleteHoroscopeSign($id: ID!) {
            deleteHoroscopeSign(id: $id) {
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
        message: response.errors[0]?.message || "Failed to delete sign",
      };
    }

    revalidatePath("/signs");
    return response.data.deleteHoroscopeSign;
  } catch (error) {
    console.error("Delete sign error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
