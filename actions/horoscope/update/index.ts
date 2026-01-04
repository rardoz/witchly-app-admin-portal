"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import { popHoroscopeReadCache } from "../read";

export interface UpdateHoroscopeState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default async (
  _prevState: UpdateHoroscopeState | null,
  formData: FormData,
): Promise<UpdateHoroscopeState> => {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Horoscope ID is required",
      };
    }

    // Filter out 'id' and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key]) => key !== "id" && !key.startsWith("$ACTION_"),
      ),
    );

    const formattedHoroscopeDate = dayjs(input.horoscopeDate as string).format(
      "YYYY-MM-DDT00:00:00.000[Z]",
    );

    const response = await gqlRequest(
      `
        mutation UpdateHoroscope($id: ID!, $input: UpdateHoroscopeInput!) {
            updateHoroscope(id: $id, input: $input) {
                success
                message
            }
        }
      `,
      {
        id,
        input: { ...input, horoscopeDate: formattedHoroscopeDate },
      },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to update horoscope",
      };
    }

    revalidatePath("/horoscopes");
    await popHoroscopeReadCache(id);
    return response.data.updateHoroscope;
  } catch (error) {
    console.error("Update horoscope error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
