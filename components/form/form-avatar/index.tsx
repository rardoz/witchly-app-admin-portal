"use client";

import Image from "next/image";
import { useState } from "react";
import type { Asset } from "@/types/asset";
import FormAssetModal from "../form-asset-modal";

const FormAvatar: React.FC<{
  asset?: Asset | null;
  className?: string;
  primaryColor?: string;
  noCrop?: boolean;
  onUpdateAsset: (assetId: string, publicUrl: string) => void;
}> = ({ asset, className, onUpdateAsset, primaryColor, noCrop }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <button
        type="button"
        className="cursor-pointer relative"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <div
          className="w-28 h-28 mr-2 bg-purple-900 relative rounded-full overflow-hidden border-2 border-white shadow z-1"
          style={primaryColor ? { borderColor: primaryColor } : {}}
        >
          <small className="absolute top-1/3 left-0 text-center w-full z-0">
            Click to upload
          </small>
          {asset?.publicUrl && (
            <Image
              src={
                asset?.publicUrl?.includes(".gif")
                  ? asset?.publicUrl
                  : `${asset?.publicUrl}?w=300&h=300&q=100` || ""
              }
              alt="click to upload"
              fill
              unoptimized
              className="absolute inset-0 h-full w-full object-cover z-1"
            />
          )}
        </div>
      </button>
      <FormAssetModal
        id="avatar-asset"
        name="asset"
        open={open}
        cropWidth={noCrop ? undefined : 300}
        cropHeight={noCrop ? undefined : 300}
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

export default FormAvatar;
