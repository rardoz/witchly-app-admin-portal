"use server";

import gqlRequest from "@/lib/gql";

export default async (formData: FormData) => {
  const email = formData.get("email") as string;
  const keepMeLoggedIn = formData.get("remember") === "on";
  const verificationCode = formData.get("verificationCode") as string;
  // Call API to send login code
  const response = await gqlRequest(
    `
      mutation CompleteLogin($input: CompleteLoginInput!) {   
        completeLogin(input: $input) {
            success
            message
            sessionToken
            refreshToken
            expiresIn
            expiresAt
            userId
        }
      }
      `,
    { input: { email, verificationCode, keepMeLoggedIn } },
  );
  return response;
};
