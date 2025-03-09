import { prismaClientHttp } from "@/db/db.server";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";
import type { Route } from "./+types/route";
import { redirect, useFetcher, useFetchers } from "react-router";
import { z } from "zod";
import {
  buildServerError,
  createServerValidate,
} from "@/lib/createServerValidate";
import { typographyVariants } from "@/components/ui/typography";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getClerkClient,
  getUserId,
  getUserPublicMetadata,
} from "@/server/clerk";

export async function loader(args: Route.LoaderArgs) {
  const [publicMetadata, locations] = await Promise.all([
    getUserPublicMetadata(args),
    prismaClientHttp.location.findMany(),
  ]);

  const organisationIdsFromLocations = locations.map(
    (location) => location.organizationId
  );

  const clerkClient = getClerkClient();

  const allOrganisations = await clerkClient.organizations.getOrganizationList({
    organizationId: organisationIdsFromLocations,
  });

  const organisations = Object.fromEntries(
    allOrganisations.data.map((organisation) => {
      return [
        organisation.id,
        {
          id: organisation.id,
          logoUrl: organisation.imageUrl,
          name: organisation.name,
        },
      ];
    })
  );

  return {
    locations,
    organisations,
    activeLocationId: publicMetadata.activeLocationId,
  };
}

const validators = {
  onSubmit: z.object({
    id: z.string().min(1),
  }),
};

const serverValidate = createServerValidate({
  validators,
});

export async function action(args: Route.ActionArgs) {
  const formData = await args.request.formData();

  const result = await serverValidate(formData);

  if (!result.success) {
    return result.errors.formState;
  }

  const location = await prismaClientHttp.location.findUnique({
    where: { id: result.data.id },
  });

  if (!location) {
    return buildServerError("Location not found", result.data).errors.formState;
  }

  const userId = await getUserId(args);

  const clerkClient = getClerkClient();

  const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      activeLocationId: result.data.id,
    },
  });

  if (updatedUser.publicMetadata.activeLocationId !== result.data.id) {
    return buildServerError("Failed to switch location", result.data).errors
      .formState;
  }

  return redirect("/dashboard");
}

export default function Route({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className={typographyVariants({ variant: "h3" })}>
          Switch Location
        </h1>
        <p>Choose which location to log climbs</p>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        {loaderData.locations.map((location) => (
          <EditActiveLocation
            key={location.id}
            actionData={actionData}
            activeId={loaderData.activeLocationId}
            location={{
              ...location,
              organisation: loaderData.organisations[location.organizationId],
            }}
          />
        ))}
      </div>
    </div>
  );
}

const FETCHER_KEY = "switch-location";

function EditActiveLocation({
  activeId: activeIdProp,
  actionData,
  location,
}: {
  activeId: string | undefined;
  actionData: Route.ComponentProps["actionData"];
  location: {
    id: string;
    name: string;
    organisation: {
      logoUrl: string;
      name: string;
    };
  };
}) {
  const fetchers = useFetchers();
  const switchLocationFetcher = fetchers.find(
    (fetcher) => fetcher.key === FETCHER_KEY
  );

  const fetcher = useFetcher({ key: FETCHER_KEY });
  const activeId = switchLocationFetcher?.formData
    ? switchLocationFetcher.formData?.get("id")
    : activeIdProp;

  const form = useForm({
    defaultValues: {
      id: location.id,
    },
    validators,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, actionData ?? {}),
      [actionData]
    ),
    onSubmit: ({ value }) => {
      fetcher.submit(value, {
        method: "post",
      });
    },
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  return (
    <fetcher.Form
      method="post"
      onSubmit={() => form.handleSubmit()}
      className="w-full max-w-sm"
    >
      {formErrors.map((error) => (
        <p key={error as string}>{error}</p>
      ))}

      <form.Field name="id">
        {(field) => {
          return (
            <Button
              type="submit"
              name={field.name}
              value={field.state.value}
              variant="outline"
              className="w-full max-w-sm h-auto py-4 flex items-center justify-between"
            >
              {location.organisation ? (
                <img
                  src={location.organisation.logoUrl}
                  alt={location.organisation.name}
                  className="size-8 rounded-full"
                />
              ) : null}
              <div className="flex-grow ml-4">
                <div className="flex flex-col gap-1 items-start">
                  <span className={typographyVariants({ variant: "muted" })}>
                    {location.organisation.name}
                  </span>
                  <span
                    className={typographyVariants({
                      variant: "lead",
                      className: "leading-4",
                    })}
                  >
                    {location.name}
                  </span>
                </div>
              </div>
              {activeId === location.id ? (
                <CheckIcon className="size-5 transition-all" />
              ) : null}
            </Button>
          );
        }}
      </form.Field>
    </fetcher.Form>
  );
}
