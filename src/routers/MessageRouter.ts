import express from "express";
import { protect } from "../middleware/Protected";
import {
  allMessages,
  sendMessage,
  sendfile,
} from "../controllers/MessageController";
import { Upload } from "../middleware/upload";

const messageRouter = express.Router();

messageRouter.post("/", protect, sendMessage);
// messageRouter.post("/sendfile", protect, Upload.single("image"), sendfile);
messageRouter.get("/:chatId", protect, allMessages);
// messageRouter.post("/uploadfiles",protect ,)

export { messageRouter };
