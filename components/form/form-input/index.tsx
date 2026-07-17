import classNames from "classnames";
import { forwardRef } from "react";

const FormInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      id={props.id || props.name || undefined}
      className={classNames(
        "block min-w-0 grow bg-gray-800 py-1.5 px-3 text-base text-white placeholder:text-gray-500 sm:text-sm/6 rounded-md outline-1 -outline-offset-1 outline-gray-600 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 w-full",
        className,
      )}
    />
  );
});

export default FormInput;
