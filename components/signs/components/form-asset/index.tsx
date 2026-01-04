"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import FormAssetModal from "@/components/form/form-asset-modal";
import FormLabel from "@/components/form/form-label";
import type { Asset } from "@/types/asset";

const FormAsset: React.FC<{
  asset?: Asset | null;
  onUpdateAsset: (assetId: string, publicUrl: string) => void;
  primaryColor?: string;
  type?: string;
}> = ({ asset, onUpdateAsset, primaryColor, type = "card" }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <FormLabel
        htmlFor={`${type}-asset`}
        className=" text-sm font-medium text-gray-700 capitalize flex items-center gap-2"
      >
        {type} Asset
        {asset?.publicUrl && (
          <Link target="_blank" href={asset?.publicUrl}>
            <FaEye />
          </Link>
        )}
      </FormLabel>
      <button
        className={`bg-purple-900/20 relative cursor-pointer border-2 border-white`}
        style={{
          borderColor: primaryColor,
          width: `${400}px`,
          height: `${200}px`,
        }}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <small className="text-center left-0 z-0 text-wrap w-full px-4 block">
          Click to upload the {type} asset
        </small>
        {asset?.publicUrl && (
          <Image
            src={
              `${asset?.publicUrl}`.includes(".gif")
                ? `${asset?.publicUrl}`
                : `${asset?.publicUrl}?w=400&h=200&q=100` || ""
            }
            alt="file asset preview"
            fill
            unoptimized
            className="absolute z-1 h-full w-full "
          />
        )}
      </button>
      <FormAssetModal
        id={`${type}-asset`}
        name="asset"
        open={open}
        cropWidth={800}
        cropHeight={400}
        onClose={(assetId?: string, publicURL?: string) => {
          setOpen(false);
          if (assetId && publicURL) {
            onUpdateAsset(assetId, publicURL);
          }
        }}
      />
    </div>
  );
};

export default FormAsset;
