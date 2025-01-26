import jwt from "jsonwebtoken";
import {
  loadMessages,
  sendMessage,
  getUsersWithChats,
} from "../controllers/messageController.js";
import User from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";

export const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Access Denied. Token Not Provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    return next(new Error("Invalid token"));
  }
};

export const messageSocketHandler = (socket, io) => {
  socket.on("joinRoom", ({ targetUserId }) => {
    const userId = socket.user._id;
    const roomId = [userId, targetUserId].sort().join("_");
    socket.join(roomId);
    loadMessages(userId, targetUserId, socket);
  });

  socket.on("sendMessage", ({ targetUserId, messageText }) => {
    const userId = socket.user._id;
    const roomId = [userId, targetUserId].sort().join("_");
    sendMessage(userId, targetUserId, messageText, roomId, io);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
};

const router = express.Router();

router.get("/chats", authMiddleware, getUsersWithChats);

export default router;
