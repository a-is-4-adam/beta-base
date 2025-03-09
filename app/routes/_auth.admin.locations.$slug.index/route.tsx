import { buttonVariants } from "@/components/ui/button";
import { typographyVariants } from "@/components/ui/typography";
import { getLocationBySlug } from "@/db/locations.server";
import type { Route } from "./+types/route";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/link";

export async function loader(args: Route.LoaderArgs) {
  return {
    location: await getLocationBySlug(args),
  };
}

export default function Route({ loaderData, params }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className={typographyVariants({ variant: "h3" })}>
        {loaderData.location.name}
      </h1>
      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Manage</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Link
              to={`/admin/locations/${loaderData.location.slug}/routes/edit`}
              className={buttonVariants({ size: "sm" })}
            >
              Edit Routes
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
