import { typographyVariants } from "@/components/ui/typography";
import { getAuth } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/route";
import { getLocationsByOrganisationId } from "@/db/locations.server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const loader = async (args: Route.LoaderArgs) => {
  const { orgId } = await getAuth(args);
  const locations = await getLocationsByOrganisationId({ id: orgId });
  return {
    locations,
  };
};

export default function Route({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={typographyVariants({ variant: "h3" })}>
          Manage Locations
        </h1>
        <p>Which location would you like to manage?</p>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        {loaderData.locations.map((location) => (
          <Card key={location.id} className="w-full max-w-sm">
            <CardHeader>
              <Link to={`/admin/locations/${location.slug}`}>
                <CardTitle>{location.name}</CardTitle>
              </Link>
            </CardHeader>
            <CardFooter className="flex justify-end">
              <Link
                to={`/admin/locations/${location.slug}/routes/edit`}
                className={buttonVariants({ size: "sm" })}
              >
                Edit Routes
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
