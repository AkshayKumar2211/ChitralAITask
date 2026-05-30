import { Readable } from "stream";
import { cloudinary } from "../config/cloudinary";
import { env } from "../config/env";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  bytes: number;
}

export function uploadBuffer(
  buffer: Buffer,
  originalName: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const sanitized = originalName.replace(/[^\w.-]+/g, "_");
    const publicId = `${Date.now()}-${sanitized.replace(/\.[^.]+$/, "")}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: "raw",
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary upload failed"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
        });
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

export async function deleteFile(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}
