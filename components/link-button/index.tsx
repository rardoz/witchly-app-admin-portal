import classNames from "classnames";
import Link, { type LinkProps } from "next/link";

const LinkButton: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps
> = ({ className, ...props }) => {
  return (
    <Link
      {...props}
      className={classNames(
        "flex items-center justify-center gap-2 btn rounded-md bg-purple-700 hover:bg-fuchsia-700 disabled:hover:bg-purple-500 cursor-pointer p-2",
        className,
      )}
    />
  );
};

export default LinkButton;
