import { getAppToken } from "../auth/app-token";
import { auth } from "../auth/auth";

export async function restRequest(
  endpoint: string,
  body: BodyInit,
  headers?: HeadersInit,
  shouldThrowGenericErrors = true,
) {
  const session = await auth();
  const res = await fetch(`${process.env.API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        session?.appToken || (await getAppToken()).token
      }`,
      ...(session?.userToken && { "X-Session-Token": session.userToken }),
      ...headers,
    },
    body,
  });
  if (shouldThrowGenericErrors) {
    const status = res.status;
    if (status > 399) {
      throw new Error(
        `GraphQL request failed with status ${status}, ${session?.appToken} user: ${session?.userToken}`,
      );
    }
  }
  return res.json();
}
