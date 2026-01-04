import Image from "next/image";

const CardImage: React.FC<{
  alt: string;
  src?: string;
  unoptimized?: boolean;
  className?: string;
  imageClassName?: string;
}> = ({
  src,
  alt,
  unoptimized,
  className = "h-28 min-h-28",
  imageClassName = "object-contain",
}) => {
  return (
    <div
      className={`w-full mr-2 relative rounded-lg overflow-hidden border-2 border-gray-600 shadow z-1 ${className}`}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={unoptimized}
          className={`absolute inset-0 h-full w-full z-1 ${imageClassName}`}
        />
      )}
      {!src && (
        <div className="flex h-full w-full items-center justify-center text-gray-500">
          No Image
        </div>
      )}
    </div>
  );
};

export default CardImage;
