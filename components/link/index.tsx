import classNames from "classnames";
import { default as NextLink } from "next/link";

const Link = ({
  className,
  ...props
}: React.ComponentProps<typeof NextLink>) => {
  return (
    <NextLink
      {...props}
      className={classNames(
        "transition-colors duration-300 hover:text-purple-400",
        className,
      )}
    />
  );
};

export default Link;
