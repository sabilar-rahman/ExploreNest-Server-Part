import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

// removing file extension from the given files
const removeExtension = (filename: string) => {
  return filename.split(".").slice(0, -1).join(".");
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (_req, file) =>
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      removeExtension(file.originalname),
  },
});

export const multerUpload = multer({ storage });
