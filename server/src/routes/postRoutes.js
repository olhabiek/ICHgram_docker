import express from "express";
import upload from "../middlewares/multer.js";
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
  getAllPosts,
  getOtherUserPosts,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getFollowingPosts } from "../controllers/postController.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createPost);

router.get("/single/:postId", authMiddleware, getPostById);

router.put("/:postId", authMiddleware, upload.single("image"), updatePost);

router.delete("/:postId", authMiddleware, deletePost);

router.get("/all", authMiddleware, getUserPosts);

router.get("/all/public", authMiddleware, getAllPosts);

router.get("/:user_id", authMiddleware, getOtherUserPosts);

export default router;
