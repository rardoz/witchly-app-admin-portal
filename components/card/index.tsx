const Card: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg shadow w-full flex flex-col">
      {children}
    </div>
  );
};

export default Card;
