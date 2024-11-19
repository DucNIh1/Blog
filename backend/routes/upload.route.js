import multer from "multer";
import express from "express";
import cloudinary from "../cloudinary/config.js";
import checkAuth from "../middlewares/checkAuth.js";
const router = express.Router();

// Cấu hình multer
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  checkAuth,
  upload.single("image"),
  async function (req, res, next) {
    try {
      console.log(req.file);
      const result = await cloudinary.uploader.upload(req.file.path);
      res
        .status(200)
        .json({ message: "Upload image successfully", data: result });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
