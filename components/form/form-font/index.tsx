import {
  Roboto,
  Roboto_Condensed,
  Roboto_Mono,
  Roboto_Serif,
  Roboto_Slab,
} from "next/font/google";
import FormLabel from "../form-label";
import FormSelect from "../form-select";

const roboto = Roboto({
  subsets: ["latin"],
});
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
});
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
});
const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export const FONT_FAMILIES = [
  { label: "Roboto", value: roboto.style.fontFamily },
  { label: "Roboto Condensed", value: robotoCondensed.style.fontFamily },
  { label: "Roboto Slab", value: robotoSlab.style.fontFamily },
  { label: "Roboto Serif", value: robotoSerif.style.fontFamily },
  { label: "Roboto Mono", value: robotoMono.style.fontFamily },
];

const FormFont = ({
  value,
  handleChange,
  required,
  showNull,
}: {
  required?: boolean;
  value?: string;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showNull?: boolean;
}) => {
  return (
    <>
      <FormLabel htmlFor="font">Font Family</FormLabel>
      <FormSelect
        id="font"
        name="font"
        value={value || (showNull ? undefined : FONT_FAMILIES[0].value)}
        onChange={handleChange}
        required={required}
      >
        {showNull && <option value="">Select Font</option>}
        {FONT_FAMILIES.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </FormSelect>
    </>
  );
};

export default FormFont;
