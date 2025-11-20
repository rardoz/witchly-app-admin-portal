import FormInput from "../form-input";

const FormCheckbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
) => {
  return (
    <FormInput
      {...props}
      type="checkbox"
      className="focus:outline-none outline-none"
    />
  );
};

export default FormCheckbox;
