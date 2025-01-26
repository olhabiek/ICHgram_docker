import express from "express";
import {
  createComment,
  getPostComments,
  deleteComment,
  likeComment,
} from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:postId", authMiddleware, createComment);

router.get("/:postId", authMiddleware, getPostComments);

router.delete("/:commentId", authMiddleware, deleteComment);

router.post("/like/:commentId", authMiddleware, likeComment);

export default router;
