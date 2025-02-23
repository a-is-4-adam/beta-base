import { SelectItem } from "@/components/ui/select";

import { JollySelect } from "@/components/ui/select";

const SECTORS = [
  { key: "Bow" },
  { key: "Cave" },
  { key: "Cooper's Hill" },
  { key: "Cove" },
  { key: "Open Book" },
  { key: "Prow" },
  { key: "Split City" },
  { key: "Sunroom" },
  { key: "Sunshine" },
  { key: "Welcome Wall" },
];

export function SectorSelect(
  props: Omit<React.ComponentPropsWithoutRef<typeof JollySelect>, "children">
) {
  return (
    <JollySelect {...props} items={SECTORS} placeholder="Choose a sector">
      {(item) => <SelectItem key={item.key}>{item.key}</SelectItem>}
    </JollySelect>
  );
}
