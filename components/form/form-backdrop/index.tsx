"use client";

import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import type { Asset } from "@/types/asset";
import FormAssetModal from "../form-asset-modal";

const FormBackdrop: React.FC<{
  asset?: Asset | null;
  onUpdateAsset: (assetId: string, publicUrl: string) => void;
}> = ({ asset, onUpdateAsset }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="bg-purple-900/20 h-72 w-full relative cursor-pointer"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <small className="text-center w-full left-0 z-0">
          Click to upload a backdrop
        </small>
        {asset?.publicUrl && (
          <Image
            src={
              `${asset?.publicUrl}`.includes(".gif")
                ? `${asset?.publicUrl}`
                : `${asset?.publicUrl}?w=2200&h=400&q=100` || ""
            }
            alt="file asset preview"
            fill
            unoptimized
            className={classNames(
              "absolute inset-0 z-1 h-full w-full object-cover",
            )}
          />
        )}
      </button>
      <FormAssetModal
        id="backdrop-asset"
        name="asset"
        open={open}
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

export default FormBackdrop;
