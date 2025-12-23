import type { Session } from "next-auth";
import { getAppToken } from "../auth/app-token";
import { auth } from "../auth/auth";

export async function gqlRequestWithAuth(
  session: Session | null,
  query: string,
  variables?: unknown,
  shouldThrowGenericErrors = true,
) {
  const res = await fetch(`${process.env.API_BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        session?.appToken || (await getAppToken()).token
      }`,
      ...(session?.userToken && { "X-Session-Token": session.userToken }),
    },
    body: JSON.stringify({ query, variables }),
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

export default async function gqlRequest(
  query: string,
  variables?: unknown,
  shouldThrowGenericErrors = true,
) {
  const session = await auth();

  const res = await fetch(`${process.env.API_BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        session?.appToken || (await getAppToken()).token
      }`,
      ...(session?.userToken && { "X-Session-Token": session.userToken }),
    },
    body: JSON.stringify({ query, variables }),
  });
  //todo remove this
  if (shouldThrowGenericErrors) {
    const status = res.status;
    if (status > 399) {
      throw new Error(`GraphQL request failed with status ${status}`);
    }
  }
  return res.json();
}
