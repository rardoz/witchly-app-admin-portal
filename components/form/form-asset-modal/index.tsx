import classNames from "classnames";
import Image from "next/image";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
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
  onClose: (assetID?: string, publicUrl?: string) => void;
}

const FormAssetModal: React.FC<FormAssetModalProps> = ({
  open,
  onClose,
  name,
  accept,
  id,
}) => {
  const [updateAssetState, updateAssetFormAction] = useActionState<
    UpdateAssetState | null,
    FormData
  >(updateAssetAction, null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initializeChunkedUploadState, initializeChunkedUploadAction] =
    useActionState<CreateAssetState | null, FormData>(createAssetAction, null);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setFileName(file?.name || null);
    setFilePreview(file ? URL.createObjectURL(file) : null);
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const currentFile = fileInputRef.current?.files?.[0];
    if (!currentFile) {
      console.error("No file selected");
      return;
    }
    formData.append("fileName", currentFile.name);
    formData.append("mimeType", currentFile.type);
    formData.append("totalSize", currentFile.size.toString());
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
      // TODO: SEND BACK EVENT OF data.asset.id, publicURL
      // and also make sure this doesnt fire until the status is completed
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
      fileInputRef.current?.files?.[0]
    ) {
      const chunkSize = initializeChunkedUploadState.data.chunkSize;
      const nextChunkIndex = chunkIndex + 1;
      const totalChunks = Math.ceil(
        fileInputRef.current.files[0].size / chunkSize,
      );
      if (nextChunkIndex > totalChunks) {
        // All chunks uploaded

        return;
      }
      // Proceed to upload the first chunk
      const formData = new FormData();
      formData.append("uploadID", initializeChunkedUploadState.data.uploadId);
      formData.append("chunkIndex", chunkIndex.toString());

      const file = fileInputRef.current.files[0];

      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      formData.append("chunk", chunk, file.name);
      console.log(
        "chunk check: ",
        updateAssetState?.data?.chunkIndex,
        " ",
        chunkIndex,
      );
      if (
        (chunkIndex === 0 && !updateAssetState) ||
        updateAssetState?.data?.chunkIndex === chunkIndex - 1
      ) {
        console.log("next");
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
  ]);

  console.log("updated state", updateAssetState);

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
                  <Image
                    src={filePreview}
                    alt="file asset preview"
                    width="400"
                    height="400"
                    className="w-auto h-full max-h-[60vh] max-w-[60vw]"
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold my-4">Create Asset</h2>
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
              id={id}
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
