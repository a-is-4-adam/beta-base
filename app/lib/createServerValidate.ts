import { decode } from "decode-formdata";
import type {
  FormOptions,
  StandardSchemaV1,
  Validator,
} from "@tanstack/form-core";
import type { FormState } from "@tanstack/form-core";

type ServerFormState<TFormData> = Pick<
  FormState<TFormData>,
  "values" | "errors" | "errorMap"
>;

type CreateServerValidateOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined
> = Omit<FormOptions<TFormData, TFormValidator>, "validators"> & {
  validators: Omit<
    FormOptions<TFormData, TFormValidator>["validators"],
    "onSubmit"
  > & {
    onSubmit: StandardSchemaV1<TFormData>;
  };
};

type ServerValidateFailureResult<TFormData> = {
  success: false;
  errors: {
    formState: ServerFormState<TFormData>;
  };
};

type ServerValidateSuccessResult<TFormData> = {
  success: true;
  data: TFormData;
};

type ServerValidateResult<TFormData> =
  | ServerValidateSuccessResult<TFormData>
  | ServerValidateFailureResult<TFormData>;

export const createServerValidate =
  <
    TFormData,
    TFormValidator extends Validator<TFormData, unknown> | undefined = undefined
  >(
    defaultOpts: CreateServerValidateOptions<TFormData, TFormValidator>
  ) =>
  async (
    formData: FormData,
    info?: Parameters<typeof decode>[1]
  ): Promise<ServerValidateResult<TFormData>> => {
    const {
      validators: { onSubmit },
    } = defaultOpts;

    const values = decode(formData, info) as never as TFormData;

    const parsed = await onSubmit["~standard"].validate(values);

    if (!parsed.issues) {
      return {
        success: true,
        data: values,
      };
    }

    const onServerErrorStr = parsed.issues
      .map((issue) => issue.message)
      .join(", ");

    return buildServerError(onServerErrorStr, values);
  };

export const initialFormState: ServerFormState<any> = {
  errorMap: {
    onServer: undefined,
  },
  values: undefined,
  errors: [],
};

export function buildServerError<TFormData>(
  error: string,
  values: TFormData
): ServerValidateFailureResult<TFormData> {
  return {
    success: false,
    errors: {
      formState: {
        errorMap: {
          onServer: error,
        },
        values,
        errors: [error],
      },
    },
  };
}
