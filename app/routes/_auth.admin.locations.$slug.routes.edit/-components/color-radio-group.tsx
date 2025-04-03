import { routeVariants } from "@/components/route-variants";
import { Label } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import type { VariantProps } from "class-variance-authority";
import { Radio } from "react-aria-components";

function ColorRadioOption({
  label,
  value,
  color,
  className,
}: {
  label: string;
  value: Extract<VariantProps<typeof routeVariants>["color"], string>;
  className?: string;
} & VariantProps<typeof routeVariants>) {
  return (
    <Radio value={value} className={routeVariants({ color, className })}>
      <Label className="sr-only">{label}</Label>
    </Radio>
  );
}

export function ColorRadioGroup(
  props: React.ComponentPropsWithoutRef<typeof RadioGroup>
) {
  return (
    <RadioGroup {...props}>
      <Label className="basis-full">Color</Label>
      <ColorRadioOption label="Yellow" value="yellow" color="yellow" />
      <ColorRadioOption label="Teal" value="teal" color="teal" />
      <ColorRadioOption label="Blue" value="blue" color="blue" />
      <ColorRadioOption label="Purple" value="purple" color="purple" />
      <ColorRadioOption label="Pink" value="pink" color="pink" />
      <ColorRadioOption label="Green" value="green" color="green" />
      <ColorRadioOption label="Red" value="red" color="red" />
      <ColorRadioOption label="Black" value="black" color="black" />
      <ColorRadioOption label="White" value="white" color="white" />
      <ColorRadioOption label="Wood" value="wood" color="wood" />
    </RadioGroup>
  );
}
