import { S3Client } from "@aws-sdk/client-s3";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const REGION = process.env.AWS_REGION || "us-east-1";

export const s3Client = new S3Client({
  region: REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET as string;
export const PUBLIC_BASE_URL = process.env.AWS_S3_PUBLIC_URL || (REGION.startsWith("cn-")
  ? `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com.cn`
  : `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com`);
