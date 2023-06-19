"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = __importDefault(require("express"));
const Protected_1 = require("../middleware/Protected");
const MessageController_1 = require("../controllers/MessageController");
const upload_1 = require("../middleware/upload");
const messageRouter = express_1.default.Router();
exports.messageRouter = messageRouter;
messageRouter.post("/", Protected_1.protect, MessageController_1.sendMessage);
messageRouter.post("/sendfile", Protected_1.protect, upload_1.Upload.single("image"), MessageController_1.sendfile);
messageRouter.get("/:chatId", Protected_1.protect, MessageController_1.allMessages);
