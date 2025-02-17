import { buttonVariants } from "@/components/ui/button";
import { labelVariants } from "@/components/ui/field";
import { inputStyles } from "@/components/ui/textfield";
import { typographyVariants } from "@/components/ui/typography";
import { SignIn } from "@clerk/react-router";

export default function Route() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "!w-full",
          cardBox: "!w-full border-none shadow-none rounded-none",
          card: "p-0 bg-transparent block !shadow-none",
          input: inputStyles({
            className: "!shadow-none !border",
          }),
          formFieldLabel: labelVariants(),
          formButtonPrimary: buttonVariants({
            className: "!shadow-none",
          }),
          header: "!hidden",
          footer: "bg-none",
          footerAction: typographyVariants({
            variant: "p",
            className: "my-10 ",
          }),
          socialButtonsBlockButton: buttonVariants({
            variant: "outline",
            className: "!shadow-none !border",
          }),
        },
        layout: {
          socialButtonsPlacement: "bottom",
        },
      }}
    />
  );
}
