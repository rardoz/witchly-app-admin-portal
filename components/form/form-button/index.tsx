import classNames from "classnames";

const FormButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      type="submit"
      className={classNames(
        "btn rounded-md bg-purple-700 hover:bg-fuchsia-700 disabled:hover:bg-purple-500 cursor-pointer p-2",
        className,
      )}
    />
  );
};

export default FormButton;
