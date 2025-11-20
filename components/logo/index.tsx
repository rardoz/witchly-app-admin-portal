import classNames from "classnames";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={classNames(
        "my-4 text-4xl font-bold text-fuchsia-300",
        className,
      )}
    >
      Witchly
    </div>
  );
};

export default Logo;
