import FormLabel from "../form-label";
import FormSelect from "../form-select";

const FormStatus = ({
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
      <FormLabel htmlFor="status">Status</FormLabel>
      <FormSelect
        id="status"
        name="status"
        value={value || (showNull ? undefined : "paused")}
        onChange={handleChange}
        required={required}
      >
        {showNull && <option value="">Select Status</option>}
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="deleted">Deleted</option>
      </FormSelect>
    </>
  );
};

export default FormStatus;
