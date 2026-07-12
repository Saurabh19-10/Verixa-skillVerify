import express from "express";

import {
  sendMessage,
  getConversation,
  markMessagesAsRead,
  getRecentChats,
} from "../controllers/chatController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/recent", protect, getRecentChats);

router.get("/:userId", protect, getConversation);

router.post("/send", protect, sendMessage);

router.patch("/:userId/read", protect, markMessagesAsRead);

export default router;