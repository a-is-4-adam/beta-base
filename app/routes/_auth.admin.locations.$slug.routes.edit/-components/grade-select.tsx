import { SelectItem } from "@/components/ui/select";

import { JollySelect } from "@/components/ui/select";

const GRADES = [
  { key: "VB" },
  { key: "V0-" },
  { key: "V0+" },
  { key: "V0" },
  { key: "V1" },
  { key: "V2" },
  { key: "V3" },
  { key: "V4" },
  { key: "V5" },
  { key: "V6" },
  { key: "V7" },
  { key: "V8" },
  { key: "V9" },
  { key: "V10" },
];

export function GradeSelect(
  props: Omit<React.ComponentPropsWithoutRef<typeof JollySelect>, "children">
) {
  console.log("🚀 ~ props:", props);

  return (
    <JollySelect {...props} items={GRADES} placeholder="Choose a grade">
      {(item) => <SelectItem key={item.key}>{item.key}</SelectItem>}
    </JollySelect>
  );
}
