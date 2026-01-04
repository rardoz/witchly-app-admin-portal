import FormLabel from "../form-label";
import FormSelect from "../form-select";

const FormSign = ({
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
      <FormLabel htmlFor="sign">Sign</FormLabel>
      <FormSelect
        id="sign"
        name="sign"
        value={value || (showNull ? undefined : "capricorn")}
        onChange={handleChange}
        required={required}
      >
        {showNull && <option value="">Select Sign</option>}
        <option value="capricorn">Capricorn (December 22 - January 19)</option>
        <option value="aquarius">Aquarius (January 20 - February 18)</option>
        <option value="pisces">Pisces (February 19 - March 20)</option>
        <option value="aries">Aries (March 21 - April 19)</option>
        <option value="taurus">Taurus (April 20 - May 20)</option>
        <option value="gemini">Gemini (May 21 - June 20)</option>
        <option value="cancer">Cancer (June 21 - July 22)</option>
        <option value="leo">Leo (July 23 - August 22)</option>
        <option value="virgo">Virgo (August 23 - September 22)</option>
        <option value="libra">Libra (September 23 - October 22)</option>
        <option value="scorpio">Scorpio (October 23 - November 21)</option>
        <option value="sagittarius">
          Sagittarius (November 22 - December 21)
        </option>
      </FormSelect>
    </>
  );
};

export default FormSign;
