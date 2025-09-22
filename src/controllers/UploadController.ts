import { Request, Response } from "express";
import { UploadService } from "../services/UploadService";
import { ResponseUtil } from "../utils/response";
import { logger } from "../utils/logger";

export class UploadController {
  private service: UploadService;

  constructor() {
    this.service = new UploadService();
  }

  uploadImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      if (!files.length) {
        ResponseUtil.badRequest(res, "No images provided. Use field name 'images'.");
        return;
      }

      const results = await this.service.uploadMany(
        files.map((f) => ({
          buffer: f.buffer,
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
        }))
      );

      ResponseUtil.created(res, "Images uploaded successfully", {
        images: results,
        count: results.length,
      });
    } catch (error) {
      logger.error("Error in uploadImages controller:", error);
      ResponseUtil.internalServerError(res, "Failed to upload images");
    }
  };
}
