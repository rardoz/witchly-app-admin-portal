import FormLabel from "@/components/form/form-label";
import FormSelect from "@/components/form/form-select";

const FormPhases = ({
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
      <FormLabel htmlFor="phase">Phase</FormLabel>
      <FormSelect
        id="phase"
        name="phase"
        value={value || (showNull ? undefined : "new moon")}
        onChange={handleChange}
        required={required}
      >
        {showNull && <option value="">Select Phase</option>}
        <option value="new moon">New Moon</option>
        <option value="waxing crescent">Waxing Crescent</option>
        <option value="first quarter">First Quarter</option>
        <option value="waxing gibbous">Waxing Gibbous</option>
        <option value="full moon">Full Moon</option>
        <option value="waning gibbous">Waning Gibbous</option>
        <option value="last quarter">Last Quarter</option>
        <option value="waning crescent">Waning Crescent</option>
      </FormSelect>
    </>
  );
};

export default FormPhases;
