import { useCvContext } from "../hooks/useCv";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
export const CvList = () => {
  const { cvs } = useCvContext();

  return (
    <Combobox items={cvs}>
      <ComboboxInput placeholder="Select a CV" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {cvs.map((cv) => (
            <ComboboxItem key={cv.id} value={cv.id}>
              {cv.originalFileName}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
