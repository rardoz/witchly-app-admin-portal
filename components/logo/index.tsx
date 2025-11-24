import classNames from "classnames";
import Link from "../link";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={classNames(
        "my-4 text-4xl font-bold text-fuchsia-300",
        className,
      )}
    >
      <Link href="/">Witchly</Link>
    </div>
  );
};

export default Logo;
