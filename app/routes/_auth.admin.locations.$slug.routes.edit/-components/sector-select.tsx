import { SelectItem } from "@/components/ui/select";

import { JollySelect } from "@/components/ui/select";

const SECTORS = {
  enoggera: [
    { key: "The Bow" },
    { key: "The Cave" },
    { key: "Slab Lab" },
    { key: "The Cove" },
    { key: "Open Book" },
    { key: "The Prow" },
    { key: "Split City" },
    { key: "Sunroom" },
    { key: "Sunshine Sector" },
    { key: "Welcome Wall" },
  ],
  morningside: [
    { key: "Blue Sky" },
    { key: "Braille Trail" },
    { key: "Devils Marbles" },
    { key: "Kyloe" },
    { key: "The Cave" },
    { key: "The Wave" },
    { key: "Voyager" },
    { key: "Welcome Wall" },
  ],
};

export function SectorSelect({
  location,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof JollySelect>, "children"> & {
  location: keyof typeof SECTORS;
}) {
  return (
    <JollySelect
      {...props}
      items={SECTORS[location]}
      placeholder="Choose a sector"
    >
      {(item) => <SelectItem key={item.key}>{item.key}</SelectItem>}
    </JollySelect>
  );
}
