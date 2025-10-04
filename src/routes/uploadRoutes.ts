import { Router } from "express";
import { uploadImages } from "../middleware/upload";
import { UploadController } from "../controllers/UploadController";

const router = Router();
const controller = new UploadController();

/**
 * @swagger
 * tags:
 *   - name: Uploads
 *     description: Image upload operations
 */

/**
 * @swagger
 * /api/uploads/images/public:
 *   post:
 *     summary: Upload images without authentication (for user creation form)
 *     description: Accepts multiple images with form field name `images`, uploads them to S3, and returns their public URLs. No authentication required.
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         images:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               key:
 *                                 type: string
 *                               url:
 *                                 type: string
 *                               contentType:
 *                                 type: string
 *                               size:
 *                                 type: integer
 *                         count:
 *                           type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/images/public",
  (req, res, next) => {
    uploadImages(req, res, (err?: any) => {
      if (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        res.status(400).json({ success: false, message, data: {} });
        return; // ensure void return
      }
      next();
    });
  },
  controller.uploadImages
);

export default router;
