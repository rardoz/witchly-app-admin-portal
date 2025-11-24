"use server";

import gqlRequest from "@/lib/gql";

export default async (formData: FormData) => {
  const email = formData.get("email") as string;
  const remember = formData.get("remember") === "on";

  // Call API to send login code
  const response = await gqlRequest(
    `
      mutation InitiateLogin($input: InitiateLoginInput!) {    
        initiateLogin(input: $input) {        
          success
          message
          expiresAt
        }
      }
      `,
    { input: { email } },
  );
  return response;
};
