import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET, PUBLIC_BASE_URL } from "../config/s3";
import { randomUUID } from "crypto";

export interface UploadedImageInfo {
  key: string;
  url: string;
  contentType: string;
  size: number;
}

export class UploadService {
  async uploadImageBuffer(buffer: Buffer, filename: string, contentType: string): Promise<UploadedImageInfo> {
    if (!S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET is not configured");
    }

    const ext = filename.split(".").pop()?.toLowerCase() || "bin";
    const key = `uploads/images/${new Date().toISOString().slice(0,10)}/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    });

    await s3Client.send(command);

    const url = `${PUBLIC_BASE_URL}/${key}`;

    return {
      key,
      url,
      contentType,
      size: buffer.length,
    };
  }

  async uploadMany(files: Array<{ buffer: Buffer; originalname: string; mimetype: string; size: number }>): Promise<UploadedImageInfo[]> {
    const uploads = files.map((f) => this.uploadImageBuffer(f.buffer, f.originalname, f.mimetype));
    return Promise.all(uploads);
  }
}
