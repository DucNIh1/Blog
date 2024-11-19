import express from "express";
import {
  createComment,
  getComments,
  likeComment,
} from "../controllers/comment.controller.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.get("/:id", getComments); //post_id

router.post("/", checkAuth, createComment);

router.patch("/:id/like", checkAuth, likeComment); // comment id

export default router;
