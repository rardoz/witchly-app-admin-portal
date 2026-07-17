import classNames from "classnames";
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import createAssetAction, {
  type CreateAssetState,
} from "@/actions/asset/create";
import updateAssetAction, {
  type UpdateAssetState,
} from "@/actions/asset/update";
import type { ModalProps } from "@/components/modal";
import Modal from "@/components/modal";
import FormButton from "../form-button";

interface FormAssetModalProps extends ModalProps {
  id?: string;
  accept?: string;
  name: string;
  cropWidth?: number;
  cropHeight?: number;
  onClose: (assetID?: string, publicUrl?: string) => void;
}

const FormAssetModal: React.FC<FormAssetModalProps> = ({
  open,
  onClose,
  name,
  accept,
  id,
  cropWidth,
  cropHeight,
}) => {
  const [updateAssetState, updateAssetFormAction] = useActionState<
    UpdateAssetState | null,
    FormData
  >(updateAssetAction, null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [initializeChunkedUploadState, initializeChunkedUploadAction] =
    useActionState<CreateAssetState | null, FormData>(createAssetAction, null);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);

  const handleFileChange = (file: File | null) => {
    setFileName(file?.name || null);
    setFilePreview(file ? URL.createObjectURL(file) : null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppedImageBlob(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      if (cropWidth && cropHeight) {
        // Calculate aspect ratio
        const targetAspect = cropWidth / cropHeight;
        const imageAspect = width / height;

        let cropW = width;
        let cropH = height;
        let x = 0;
        let y = 0;

        if (imageAspect > targetAspect) {
          // Image is wider, fit to height
          cropW = height * targetAspect;
          x = (width - cropW) / 2;
        } else {
          // Image is taller, fit to width
          cropH = width / targetAspect;
          y = (height - cropH) / 2;
        }

        setCrop({
          unit: "px",
          x,
          y,
          width: cropW,
          height: cropH,
        });
      }
    },
    [cropWidth, cropHeight],
  );

  const generateCroppedImage = useCallback(
    async (crop: PixelCrop) => {
      if (!imageRef.current || !crop.width || !crop.height) return;

      const image = imageRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas size to desired output dimensions
      canvas.width = cropWidth || crop.width;
      canvas.height = cropHeight || crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.95,
        );
      });
    },
    [cropWidth, cropHeight],
  );

  useEffect(() => {
    if (completedCrop) {
      generateCroppedImage(completedCrop).then((blob) => {
        if (blob) {
          setCroppedImageBlob(blob);
        }
      });
    }
  }, [completedCrop, generateCroppedImage]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let fileToUpload: File | Blob | null =
      fileInputRef.current?.files?.[0] || null;

    // If we have a crop, use the cropped image blob
    if (croppedImageBlob && fileName) {
      fileToUpload = new File([croppedImageBlob], fileName, {
        type: "image/jpeg",
      });
    }

    if (!fileToUpload) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("fileName", fileName || "image.jpg");
    formData.append("mimeType", fileToUpload.type);
    formData.append("totalSize", fileToUpload.size.toString());

    startTransition(() => {
      initializeChunkedUploadAction(formData);
    });
  };

  useEffect(() => {
    if (
      updateAssetState?.success &&
      updateAssetState?.data?.assetId &&
      updateAssetState?.data?.status === "completed" &&
      open
    ) {
      onClose(
        updateAssetState?.data?.assetId,
        updateAssetState?.data?.publicUrl,
      );
    }
  }, [updateAssetState, onClose, open]);

  useEffect(() => {
    if (
      initializeChunkedUploadState?.success &&
      initializeChunkedUploadState?.data &&
      (fileInputRef.current?.files?.[0] || croppedImageBlob)
    ) {
      const chunkSize = initializeChunkedUploadState.data.chunkSize;
      const nextChunkIndex = chunkIndex + 1;

      // Use cropped blob if available, otherwise use original file
      const fileToUpload = croppedImageBlob || fileInputRef.current?.files?.[0];

      if (!fileToUpload) return;

      const totalChunks = Math.ceil(fileToUpload.size / chunkSize);

      if (nextChunkIndex > totalChunks) {
        return;
      }

      const formData = new FormData();
      formData.append("uploadID", initializeChunkedUploadState.data.uploadId);
      formData.append("chunkIndex", chunkIndex.toString());

      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, fileToUpload.size);
      const chunk = fileToUpload.slice(start, end);
      formData.append("chunk", chunk, fileName || "image.jpg");

      if (
        (chunkIndex === 0 && !updateAssetState) ||
        updateAssetState?.data?.chunkIndex === chunkIndex - 1
      ) {
        startTransition(() => {
          updateAssetFormAction(formData);
        });

        setChunkIndex(nextChunkIndex);
      }
    }
  }, [
    initializeChunkedUploadState,
    chunkIndex,
    updateAssetFormAction,
    updateAssetState,
    croppedImageBlob,
    fileName,
  ]);

  const isGif =
    fileName?.toLowerCase().endsWith(".gif") ||
    fileInputRef.current?.files?.[0]?.type === "image/gif";

  return (
    <Modal open={open} onClose={() => onClose()}>
      <div>
        <form onSubmit={onSubmit}>
          <div
            className={classNames(
              `relative rounded-lg flex overflow-hidden bg-purple-900/20 h-auto`,
              {
                "min-h-72": !filePreview,
              },
            )}
          >
            <div className="mx-auto flex-1 flex flex-col items-center justify-center">
              <div
                role="dialog"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={classNames(
                  `min-w-[400px] flex-1 w-full flex flex-col items-center justify-center p-2 rounded-lg border border-dashed transition-all duration-200 ${
                    isDragging
                      ? "scale-[1.02] border-purple-500 bg-white/10"
                      : "border-white/30 hover:border-purple-400 hover:bg-white/10"
                  }`,
                )}
              >
                {!filePreview && (
                  <p className="text-xs text-foreground/60">
                    drag and drop image here
                  </p>
                )}
                {filePreview && (
                  <div className="flex items-center justify-center">
                    {!isGif ? (
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={
                          cropWidth && cropHeight
                            ? cropWidth / cropHeight
                            : undefined
                        }
                      >
                        {/** biome-ignore lint/performance/noImgElement: <explanation: we need to ref the image> */}
                        <img
                          ref={imageRef}
                          src={filePreview}
                          alt="file asset preview"
                          onLoad={onImageLoad}
                          style={{ maxWidth: "600px", maxHeight: "600px" }}
                          className="w-auto h-auto object-contain"
                        />
                      </ReactCrop>
                    ) : (
                      // biome-ignore lint/performance/noImgElement: <explanation: we need to ref the image>
                      <img
                        ref={imageRef}
                        src={filePreview}
                        alt="file asset preview"
                        style={{ maxWidth: "600px", maxHeight: "600px" }}
                        className="w-auto h-auto object-contain"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold my-4">Create Asset</h2>
            {cropWidth && cropHeight && !isGif && (
              <p className="text-sm text-purple-400 mb-2">
                Will crop to {cropWidth}×{cropHeight}px
              </p>
            )}
            <label
              htmlFor={id || name}
              className="cursor-pointer text-sm font-semibold text-purple-400 hover:text-purple-300"
            >
              Click to upload
            </label>
            <p className="text-xs text-foreground/60">or drag and drop</p>
            <p className="mt-1 text-xs text-foreground/40">
              PNG, JPG, GIF up to 10MB
            </p>
            <input
              id={id || name}
              type="file"
              name={name}
              accept={accept}
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            {fileName && (
              <p className="mt-1 text-sm font-medium text-foreground">
                Selected: {fileName}
              </p>
            )}
          </div>
          <div className="mt-4">
            <FormButton className="w-full">Upload & Apply</FormButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FormAssetModal;
