import express from "express";
import {
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser,
} from "../controllers/followController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:userId/followers", authMiddleware, getUserFollowers);

router.get("/:userId/following", authMiddleware, getUserFollowing);

router.post("/:userId/follow/:targetUserId", authMiddleware, followUser);

router.delete("/:userId/unfollow/:targetUserId", authMiddleware, unfollowUser);

export default router;
