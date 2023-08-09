import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "instagram-clone",
    allowed_formats: ["jpg", "png", "mp4", "mov"],
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50000000,
  },
});
