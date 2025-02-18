import { prismaClientHttp } from "@/db/db.server";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";
import type { Route } from "./+types/route";
import { Form } from "react-router";
import { z } from "zod";
import { createServerValidate } from "@/lib/createServerValidate";

export async function loader() {
  const locations = await prismaClientHttp.location.findMany();
  return {
    locations,
  };
}

const validators = {
  onSubmit: z.object({
    id: z.string().min(1),
  }),
};

export const serverValidate = createServerValidate({
  validators,
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = await serverValidate(formData);
  if (!result.success) {
    return result.errors.formState;
  }
  const a = result.data;
  console.log("🚀 ~ action ~ a:", a);

  // Your form has successfully validated!
  return null;
}

export default function Route({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <div>
      <h1>Switch Location</h1>
      {loaderData.locations.map((location) => (
        <EditActiveLocation
          key={location.id}
          id={location.id}
          activeId={""}
          actionData={actionData}
        >
          {location.name}
        </EditActiveLocation>
      ))}
    </div>
  );
}

export function EditActiveLocation({
  id,
  activeId,
  actionData,
  children,
}: {
  id: string;
  activeId: string;
  actionData: Route.ComponentProps["actionData"];
  children: React.ReactNode;
}) {
  const form = useForm({
    defaultValues: {
      id: activeId,
    },
    validators,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, actionData ?? {}),
      [actionData]
    ),
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  return (
    <Form method="post" onSubmit={() => form.handleSubmit()}>
      {formErrors.map((error) => (
        <p key={error as string}>{error}</p>
      ))}

      <form.Field name="id">
        {(field) => {
          return (
            <button type="submit" name={field.name} value={id}>
              {children}
            </button>
          );
        }}
      </form.Field>
    </Form>
  );
}
