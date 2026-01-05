import Image from "next/image";

const CardImage: React.FC<{
  alt: string;
  src?: string;
  unoptimized?: boolean;
  imageContainerClassName?: string;
  placeHolderClassName?: string;
  imageClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  primaryColor?: string;
}> = ({
  src,
  alt,
  unoptimized,
  primaryColor,
  imageContainerClassName,
  placeHolderClassName = "h-28 min-h-28",
  imageClassName = "w-full",
  fill = true,
  width,
  height,
}) => {
  return (
    <>
      {src && (
        <div
          className={`relative rounded-lg overflow-hidden border-2 border-gray-600 ${imageContainerClassName}`}
          style={{ borderColor: primaryColor }}
        >
          <Image
            src={src}
            alt={alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            unoptimized={unoptimized}
            className={`${imageClassName}`}
          />
        </div>
      )}
      {!src && (
        <div
          className={`w-full relative rounded-lg overflow-hidden border-2 border-gray-600 shadow grow ${placeHolderClassName}`}
        >
          <div className="absolute flex h-full w-full items-center justify-center text-gray-500">
            No Image
          </div>
        </div>
      )}
    </>
  );
};

export default CardImage;
