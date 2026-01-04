import FormLabel from "../form-label";
import FormSelect from "../form-select";

const FormLocale = ({
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
      <FormLabel htmlFor="locale">Locale</FormLabel>
      <FormSelect
        id="locale"
        name="locale"
        value={value || (showNull ? undefined : "en")}
        onChange={handleChange}
        required={required}
      >
        {showNull && <option value="">Select Locale</option>}
        <option value="en">English (Default)</option>
        <option value="en-US">English (US)</option>
        <option value="en-CA">English (CA)</option>
        <option value="en-GB">English (UK)</option>
        <option value="fr">French (Default)</option>
        <option value="fr-FR">French (FR)</option>
        <option value="fr-CA">French (CA)</option>
        <option value="es">Spanish (Default)</option>
        <option value="es-ES">Spanish (ES)</option>
      </FormSelect>
    </>
  );
};

export default FormLocale;
