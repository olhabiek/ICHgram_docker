import express from "express";
import {
  getPostLikes,
  likePost,
  unlikePost,
  getUserLikes,
} from "../controllers/likeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:postId/likes", authMiddleware, getPostLikes);

router.post("/:postId/:userId", likePost);

router.delete("/:postId/:userId", unlikePost);

router.get("/user/:userId", getUserLikes);

export default router;
