"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";

export interface DeleteHoroscopeState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: DeleteHoroscopeState | null,
  formData: FormData,
): Promise<DeleteHoroscopeState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Horoscope ID is required",
      };
    }

    const response = await gqlRequest(
      `
        mutation DeleteHoroscope($id: ID!) {
            deleteHoroscope(id: $id) {
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
        message: response.errors[0]?.message || "Failed to delete horoscope",
      };
    }

    revalidatePath("/horoscopes");
    return response.data.deleteHoroscope;
  } catch (error) {
    console.error("Delete horoscope error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
