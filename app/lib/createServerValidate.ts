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
> = FormOptions<TFormData, TFormValidator> & {
  validators: {
    onSubmit: StandardSchemaV1<TFormData>;
  };
};

type ServerValidateResult<TFormData> =
  | {
      success: true;
      data: TFormData;
    }
  | {
      success: false;
      errors: {
        formState: ServerFormState<TFormData>;
      };
    };

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

    const formState: ServerFormState<TFormData> = {
      errorMap: {
        onServer: onServerErrorStr,
      },
      values,
      errors: [onServerErrorStr],
    };

    return {
      success: false,
      errors: {
        formState,
      },
    };
  };

export const initialFormState: ServerFormState<any> = {
  errorMap: {
    onServer: undefined,
  },
  values: undefined,
  errors: [],
};
