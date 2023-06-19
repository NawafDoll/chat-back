import express from "express";
import { protect } from "../middleware/Protected";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/ChatController";
const chatRouter = express.Router();

chatRouter.post("/", protect, accessChat);
chatRouter.get("/", protect, fetchChats);
chatRouter.post("/group", protect, createGroupChat);
chatRouter.put("/grouprename", protect, renameGroup);
chatRouter.put("/groupremove", protect, removeFromGroup);
chatRouter.put("/groupadd", protect, addToGroup);

export { chatRouter };
