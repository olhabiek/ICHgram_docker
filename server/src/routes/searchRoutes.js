import express from "express";
import { searchUsers, searchPosts } from "../controllers/searchController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users", searchUsers);

router.get("/posts", searchPosts);

export default router;
