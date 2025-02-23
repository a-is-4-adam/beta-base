import { typographyVariants } from "@/components/ui/typography";
import { getUserOrganisationList } from "@/server/clerk";
import { useAuth, useOrganizationList } from "@clerk/react-router";
import { redirect } from "react-router";
import type { Route } from "./+types/route";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export async function loader(args: Route.LoaderArgs) {
  const orgs = await getUserOrganisationList(args);

  if (!orgs.totalCount) {
    return redirect("/dashboard");
  }
  return null;
}

export default function Route() {
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const { orgId } = useAuth();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={typographyVariants({ variant: "h3" })}>
          Switch Organisation
        </h1>
        <p>Choose which organisation to edit</p>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        {userMemberships?.data.map((org) => {
          return (
            <Button
              type="button"
              variant="outline"
              className="w-full max-w-sm h-auto py-4 flex items-center justify-between"
              onPress={() =>
                setActive({ organization: org.organization.id }).then(() => {})
              }
            >
              {org.organization.imageUrl ? (
                <img
                  src={org.organization.imageUrl}
                  alt={org.organization.name}
                  className="size-8 rounded-full"
                />
              ) : null}
              <div className="flex-grow ml-4">
                <div className="flex flex-col gap-1 items-start">
                  <span
                    className={typographyVariants({
                      variant: "lead",
                      className: "leading-4",
                    })}
                  >
                    {org.organization.name}
                  </span>
                </div>
              </div>
              {orgId === org.organization.id ? (
                <CheckIcon className="size-5 transition-all" />
              ) : null}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
