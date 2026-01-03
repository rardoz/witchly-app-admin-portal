import classNames from "classnames";
import Link, { type LinkProps } from "next/link";

const LinkButton: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkProps & { variant?: "primary" | "secondary" | "success" }
> = ({ className, variant = "primary", ...props }) => {
  return (
    <Link
      {...props}
      className={classNames(
        "flex items-center justify-center gap-2 btn rounded-md cursor-pointer p-2",
        {
          "bg-purple-700 hover:bg-fuchsia-700": variant === "primary",
          "bg-blue-500 hover:bg-blue-600 ": variant === "secondary",
          "bg-green-700 hover:bg-emerald-800": variant === "success",
        },
        className,
      )}
    />
  );
};

export default LinkButton;
