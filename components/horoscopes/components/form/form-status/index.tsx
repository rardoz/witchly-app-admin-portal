import FormLabel from "@/components/form/form-label";
import FormSelect from "@/components/form/form-select";

const FormStatus = ({
  value,
  handleChange,
  showNull,
  required,
}: {
  value?: string;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  showNull?: boolean;
}) => {
  return (
    <>
      <FormLabel htmlFor="status">Status</FormLabel>
      <FormSelect
        id="status"
        name="status"
        value={value}
        onChange={handleChange}
        required={required}
      >
        {showNull && <option value="">Select Status</option>}
        <option value="sent">Sent</option>
        <option value="pending">Pending</option>
      </FormSelect>
    </>
  );
};

export default FormStatus;
