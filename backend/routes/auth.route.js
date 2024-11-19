import express from "express";
import {
  changePassword,
  forgotPassword,
  login,
  loginWithGoole,
  logout,
  refreshToken,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-auth", loginWithGoole);
router.patch("/update-password", checkAuth, changePassword);
router.post("/refresh-token", refreshToken);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
