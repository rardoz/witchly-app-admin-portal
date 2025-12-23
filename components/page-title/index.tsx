import classNames from "classnames";

const PageTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => {
  return (
    <h1
      {...props}
      className={classNames(
        "text-2xl font-bold mb-4 flex items-baseline gap-2",
        className,
      )}
    />
  );
};

export default PageTitle;
