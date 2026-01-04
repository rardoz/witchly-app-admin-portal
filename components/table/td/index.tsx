const TD: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <td
      className={`border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400 ${className || ""}`}
    >
      {children}
    </td>
  );
};

export default TD;
