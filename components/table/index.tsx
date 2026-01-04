const Table: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <table className={`table-auto w-full ${className || ""}`}>{children}</table>
  );
};

export default Table;
