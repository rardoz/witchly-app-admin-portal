import FormInput from "../form-input";
import FormLabel from "../form-label";

const FormMeta = ({
  value,
  handleChange,
  required,
  showNull,
}: {
  required?: boolean;
  value?: string[];
  handleChange?: (value: string[]) => void;
  showNull?: boolean;
}) => {
  return (
    <>
      <FormLabel htmlFor="meta">Metadata (comma separated)</FormLabel>
      <FormInput
        name="meta"
        type="text"
        value={value || (showNull ? undefined : "")}
        required={required}
        onChange={(e) => handleChange?.(e.target.value.split(","))}
      />
    </>
  );
};

export default FormMeta;
