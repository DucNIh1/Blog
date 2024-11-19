import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import checkAuth from "../middlewares/checkAuth.js";
import checkRole from "../middlewares/checkRole.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(checkAuth, checkRole("admin"), createCategory);

router.use(checkAuth, checkRole("admin"));
router.route("/:id").delete(deleteCategory).patch(updateCategory);

export default router;
