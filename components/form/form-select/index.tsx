import classNames from "classnames";

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  className,
  ...props
}) => {
  return (
    <select
      {...props}
      id={props.id || props.name || undefined}
      className={classNames(
        "min-w-0 grow bg-gray-800 py-1.5 px-3 text-white placeholder:text-gray-500 text-sm/6 rounded-md outline-1 -outline-offset-1 outline-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 w-full",
        className,
      )}
    />
  );
};

export default FormSelect;
