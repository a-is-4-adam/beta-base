import { createClerkClient } from "@clerk/react-router/api.server";
import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect } from "react-router";

export function getClerkClient() {
  return createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
}

export async function getUserId(args: Parameters<typeof getAuth>[0]) {
  const auth = await getAuth(args);

  if (!auth.userId) {
    throw redirect("/sign-in");
  }

  return auth.userId;
}

export async function getUserPublicMetadata(
  args: Parameters<typeof getAuth>[0]
) {
  const userId = await getUserId(args);

  const clerkClient = getClerkClient();

  const user = await clerkClient.users.getUser(userId);

  return user.publicMetadata;
}
