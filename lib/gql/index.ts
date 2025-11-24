import { getServerSession } from "next-auth";
import { getAppToken } from "../auth/app-token";

export default async function gqlRequest(query: string, variables?: unknown) {
  const session = await getServerSession();

  const res = await fetch(`${process.env.API_BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        session?.appToken || (await getAppToken()).token
      }`,
      ...(session?.userToken && { "X-User-Token": session.userToken }),
    },
    body: JSON.stringify({ query, variables }),
  });
  const status = res.status;
  if (status > 399) {
    throw new Error(`GraphQL request failed with status ${status}`);
  }
  return res.json();
}
