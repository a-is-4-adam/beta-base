import type { Route } from "./+types/route";

export async function action({ request }: Route.ActionArgs) {
  const json = await request.json();
  console.log("🚀 ~ action ~ json:", json);

  return null;
}
