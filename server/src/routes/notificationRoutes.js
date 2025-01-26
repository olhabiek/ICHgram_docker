import express from "express";
import {
  getUserNotifications,
  createNotification,
  deleteNotification,
  updateNotificationStatus,
} from "../controllers/notificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:userId/notifications", authMiddleware, getUserNotifications);

router.post("/", authMiddleware, createNotification);

router.delete("/:notificationId", authMiddleware, deleteNotification);

router.patch("/:notificationId", authMiddleware, updateNotificationStatus);

export default router;
