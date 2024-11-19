import express from "express";
import {
  changeUserRole,
  changeUserStatus,
  deleteMe,
  deleteUser,
  getAllUsers,
  getAuthor,
  getMe,
  updateProfile,
} from "../controllers/user.controller.js";
import checkAuth from "../middlewares/checkAuth.js";
import checkRole from "../middlewares/checkRole.js";

const router = express.Router();

router.get("/author/:id", getAuthor);

router.use(checkAuth);
// user
router.get("/get-me", getMe);
router.put("/profile", updateProfile);
router.delete("/delete-me", deleteMe);

// admin
router.use(checkRole("admin"));
router.get("/", getAllUsers);
router.patch("/:id/active", changeUserStatus);
router.patch("/:id/role", changeUserRole);
router.delete("/:id", deleteUser);
export default router;
