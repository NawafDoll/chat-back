"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allMessages = exports.sendfile = exports.sendMessage = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const MessageModel_1 = require("../module/MessageModel");
const UsersModule_1 = require("../module/UsersModule");
const ChatModel_1 = require("../module/ChatModel");
const Claudinary_1 = require("../middleware/Claudinary");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, chatId } = req.body;
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        const user_id = jsonwebtoken_1.default.decode(token);
        if (!chatId) {
            return res
                .status(400)
                .json({ message: "Invalid data passed into requist" });
        }
        var newMessage = {
            sender: user_id.id,
            content: content,
            chat: chatId,
        };
        var message = yield MessageModel_1.Message.create(newMessage);
        message = yield message.populate("sender", "username pic email ");
        message = yield message.populate("chat");
        message = yield UsersModule_1.user.populate(message, {
            path: "chat.users",
            select: "username pic emeil",
        });
        yield ChatModel_1.chat.findByIdAndUpdate(req.body.chat, {
            lastestMessage: message,
        });
        return res.json(message);
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendMessage = sendMessage;
const sendfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, chatId } = req.body;
        const { image } = req.body;
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        const user_id = jsonwebtoken_1.default.decode(token);
        // if (!content || !chatId) {
        //   return res
        //     .status(400)
        //     .json({ message: "Invalid data passed into requist" });
        // }
        const result = yield Claudinary_1.cloudinary.v2.uploader.upload(image, {
            folder: "products",
            format: "pdf",
            transformation: {
                width: 400,
                Height: 600,
                crop: "limit",
            },
        });
        var newMessage = {
            sender: user_id.id,
            content: "imagefromUploads",
            chat: chatId,
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        };
        var message = yield MessageModel_1.Message.create(newMessage);
        message = yield message.populate("sender", "username pic email ");
        message = yield message.populate("chat");
        message = yield UsersModule_1.user.populate(message, {
            path: "chat.users",
            select: "username pic emeil",
        });
        yield ChatModel_1.chat.findByIdAndUpdate(req.body.chat, {
            lastestMessage: message,
        });
        return res.json(message);
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendfile = sendfile;
const allMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield MessageModel_1.Message.find({ chat: req.params.chatId })
            .populate("sender", "username pic email")
            .populate("chat");
        res.json(messages);
    }
    catch (err) {
        console.log(err);
    }
});
exports.allMessages = allMessages;
