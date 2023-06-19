"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = __importDefault(require("express"));
const Protected_1 = require("../middleware/Protected");
const ChatController_1 = require("../controllers/ChatController");
const chatRouter = express_1.default.Router();
exports.chatRouter = chatRouter;
chatRouter.post("/", Protected_1.protect, ChatController_1.accessChat);
chatRouter.get("/", Protected_1.protect, ChatController_1.fetchChats);
chatRouter.post("/group", Protected_1.protect, ChatController_1.createGroupChat);
chatRouter.put("/grouprename", Protected_1.protect, ChatController_1.renameGroup);
chatRouter.put("/groupremove", Protected_1.protect, ChatController_1.removeFromGroup);
chatRouter.put("/groupadd", Protected_1.protect, ChatController_1.addToGroup);
