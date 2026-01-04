"use server";

import { revalidatePath } from "next/cache";
import gqlRequest from "@/lib/gql";
import signToDate from "../sign-to-date";
export interface CreateSignState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  id?: string;
}

export default async (
  _prevState: CreateSignState | null,
  formData: FormData,
): Promise<CreateSignState> => {
  try {
    // Filter out "" and Next.js action metadata keys
    const input: Record<string, unknown> = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key, value]) => !key.startsWith("$ACTION_") && value !== "",
      ),
    );

    const { signDateStart, signDateEnd } = signToDate(input.sign as string);

    const response = await gqlRequest(
      `
        mutation CreateHoroscopeSign($input: CreateHoroscopeSignInput!) {
            createHoroscopeSign(input: $input) {
                success
                message
                sign {
                    _id
                }
            }
        }
      `,
      {
        input: {
          ...input,
          signDateStart,
          signDateEnd,
        },
      },
      false,
    );
    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to create sign",
      };
    }

    revalidatePath("/signs");
    return {
      success: response.data.createHoroscopeSign.success,
      message: response.data.createHoroscopeSign.message,
      id: response.data.createHoroscopeSign.sign._id,
    };
  } catch (error) {
    console.error("Create sign error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
