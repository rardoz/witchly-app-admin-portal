import classNames from "classnames";

const FormLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  className,
  htmlFor,
  children,
  ...props
}) => {
  return (
    <label
      {...props}
      htmlFor={htmlFor || ""}
      className={classNames(
        "block text-sm/6 font-medium text-white",
        className,
      )}
    >
      {children}
    </label>
  );
};

export default FormLabel;
