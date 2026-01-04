"use server";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
export interface CreateHoroscopeState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
}

export default async (
  _prevState: CreateHoroscopeState | null,
  formData: FormData,
): Promise<CreateHoroscopeState> => {
  try {
    // Filter out "" and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
      ),
    );
    const formattedHoroscopeDate = dayjs(input.horoscopeDate as string).format(
      "YYYY-MM-DDT00:00:00.000[Z]",
    );
    const response = await gqlRequest(
      `
      mutation CreateHoroscope($input: CreateHoroscopeInput!) {
        createHoroscope(input: $input) {
          success
          message
          horoscope {
            _id
          }
        }
      }
      `,
      {
        input: { ...input, horoscopeDate: formattedHoroscopeDate },
      },
      false,
    );
    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to create horoscope",
      };
    }

    revalidatePath("/horoscopes");
    return {
      success: response.data.createHoroscope.success,
      message: response.data.createHoroscope.message,
      id: response.data.createHoroscope.horoscope._id,
    };
  } catch (error) {
    console.error("Create horoscope error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
