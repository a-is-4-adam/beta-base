import type { Route } from "./+types/route";

export async function loader(args: Route.LoaderArgs) {
  return {
    foo: true,
  };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  return <div>dashboard</div>;
}
