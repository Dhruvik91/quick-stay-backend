import multer from "multer";
import path from "path";

const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_UPLOAD_MB || "10", 10); // default 10MB per image
const MAX_FILES = parseInt(process.env.MAX_UPLOAD_FILES || "10", 10);

const storage = multer.memoryStorage();

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();
  const isAllowed = allowed.includes(ext) || file.mimetype.startsWith("image/");
  if (!isAllowed) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
};

export const uploadImages = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: MAX_FILES,
  },
  fileFilter: imageFileFilter,
}).array("images", MAX_FILES);
