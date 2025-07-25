import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:conversationId", protect, getMessages);

export default router;