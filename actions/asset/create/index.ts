"use server";

import gqlRequest from "@/lib/gql";

export interface CreateAssetState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: {
    uploadId: string;
    chunkSize: number;
  };
}

export default async (
  _prevState: CreateAssetState | null,
  formData: FormData,
): Promise<CreateAssetState> => {
  try {
    let fileName = formData.get("fileName") as string;
    const mimeType = formData.get("mimeType") as string;
    const totalSize = parseInt(formData.get("totalSize") as string, 10);

    if (!fileName) {
      return {
        success: false,
        message: "File name required",
      };
    } else if (!mimeType) {
      return {
        success: false,
        message: "MIME type required",
      };
    } else if (!totalSize) {
      return {
        success: false,
        message: "Total size must be a valid number",
      };
    }
    fileName = fileName
      .replace(/[^\x20-\x7E]/g, "") // Remove non-ASCII (emoji, accents, etc.)
      .replace(/[\r\n]/g, "") // Remove line breaks
      .replace(/[<>:"/\\|?*]/g, "_") // Replace filesystem-unsafe chars
      .trim();

    const input = {
      fileName: fileName,
      mimeType: mimeType,
      totalSize: totalSize,
      chunkSize: 5 * 1024 * 1024, // 5 MB
    };

    console.log("Initialize chunked upload input:", input);

    const response = await gqlRequest(
      `
        mutation InitializeChunkedUpload($input: ChunkUploadInitInput!) {
            initializeChunkedUpload(input: $input) {
                uploadId
                chunkSize
            }
        }
      `,
      { input },
      false,
    );

    if (response.errors) {
      return {
        success: false,
        message: response.errors[0]?.message || "Failed to update user profile",
      };
    }

    return {
      success: true,
      message: "Profile updated successfully!",
      data: {
        uploadId: response.data?.initializeChunkedUpload?.uploadId,
        chunkSize: response.data?.initializeChunkedUpload?.chunkSize,
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
