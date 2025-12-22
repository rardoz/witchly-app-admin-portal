"use server";

import crypto from "node:crypto";
import { restRequest } from "@/lib/rest";

export interface UpdateAssetState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: {
    uploadId: string;
    chunkSize: number;
    chunkIndex: number;
    assetId: string;
    publicUrl: string;
    signedUrl?: string;
    status?: "initializing" | "uploading" | "completed" | "failed";
  };
}

async function calculateChunkHash(chunk: Blob): Promise<string> {
  const arrayBuffer = await chunk.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default async (
  _prevState: UpdateAssetState | null,
  formData: FormData,
): Promise<UpdateAssetState> => {
  try {
    const chunk = formData.get("chunk") as File;
    const chunkIndex = formData.get("chunkIndex") as string;
    const uploadID = formData.get("uploadID") as string;

    if (!chunk) {
      return {
        success: false,
        message: "A file chunk is required",
      };
    } else if (!chunkIndex) {
      return {
        success: false,
        message: "Chunk index is required",
      };
    } else if (!uploadID) {
      return {
        success: false,
        message: "Upload ID is required",
      };
    }

    const response = await restRequest(
      `api/assets/chunked/upload/${uploadID}/${chunkIndex}`,
      chunk,
      {
        method: "POST",
        "Content-Type": "application/octet-stream",
        "X-Chunk-Hash": await calculateChunkHash(chunk),
      },
      false,
    );

    console.log("Upload chunk response:", response);
    console.log(
      "Upload chunk response data:",
      `api/assets/chunked/upload/${uploadID}/${chunkIndex}`,
    );
    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to upload asset chunk",
      };
    }

    return {
      success: true,
      message: "Asset chunk uploaded successfully!",
      data: {
        uploadId: response?.progress?.uploadId,
        chunkSize: response?.progress?.chunkSize,
        chunkIndex: parseInt(chunkIndex, 10),
        assetId: response?.progress?.asset?.id,
        publicUrl: response?.progress?.asset?.publicUrl,
        signedUrl: response?.progress?.asset?.signedUrl,
        status: response?.progress?.status,
      },
    };
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};
