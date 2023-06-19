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
exports.addToGroup = exports.removeFromGroup = exports.renameGroup = exports.createGroupChat = exports.fetchChats = exports.accessChat = void 0;
const ChatModel_1 = require("../module/ChatModel");
const UsersModule_1 = require("../module/UsersModule");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        const user_id = jsonwebtoken_1.default.decode(token);
        var isChat = yield ChatModel_1.chat
            .find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: user_id.id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");
        isChat = yield UsersModule_1.user.populate(isChat, {
            path: "latestMessage.sender",
            select: "username pic email",
        });
        if (isChat.length > 0) {
            res.send(isChat[0]);
        }
        else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [user_id.id, userId],
            };
        }
        const createdChat = yield ChatModel_1.chat.create(chatData);
        const FullChat = yield ChatModel_1.chat
            .findOne({ _id: createdChat.id })
            .populate("users", "-password");
        res.status(200).json(FullChat);
    }
    catch (err) {
        console.log(err);
    }
});
exports.accessChat = accessChat;
const fetchChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        const user_id = jsonwebtoken_1.default.decode(token);
        ChatModel_1.chat
            .find({ users: { $elemMatch: { $eq: user_id.id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("lastestMessage")
            .sort({ updateAt: -1 })
            .then((results) => __awaiter(void 0, void 0, void 0, function* () {
            results = yield UsersModule_1.user.populate(results, {
                path: "lastestMessage.sender",
                select: "username pic email",
            });
            return res.status(200).json(results);
        }));
    }
    catch (err) {
        console.log(err);
    }
});
exports.fetchChats = fetchChats;
const createGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    const user_id = jsonwebtoken_1.default.decode(token);
    if (!req.body.users || !req.body.name)
        return res.status(400).json({ message: "فضلا أملأ البيانات" });
    var users = JSON.parse(req.body.users);
    if (users.length < 2)
        return res
            .status(400)
            .json({ message: "لأنشاء قروب يجب ان تضيف اكثر من 2" });
    users.push(req.body.user);
    users.push(user_id.id);
    try {
        const groupChat = yield ChatModel_1.chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.body.user,
        });
        const fullGroupChat = yield ChatModel_1.chat
            .findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    }
    catch (err) {
        console.log(err);
    }
});
exports.createGroupChat = createGroupChat;
const renameGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, chatName } = req.body;
        const updateChat = yield ChatModel_1.chat
            .findByIdAndUpdate(chatId, {
            chatName,
        }, {
            new: true,
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!updateChat)
            return res.status(400).json({ message: "chat not found" });
        return res.status(200).json(updateChat);
    }
    catch (err) {
        console.log(err);
    }
});
exports.renameGroup = renameGroup;
const removeFromGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, userId } = req.body;
        const deleteUser = yield ChatModel_1.chat
            .findByIdAndUpdate(chatId, {
            $pull: { users: userId },
        }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!deleteUser)
            return res.status(400).json({ message: "chat not found" });
        return res.status(200).json(deleteUser);
    }
    catch (err) {
        console.log(err);
    }
});
exports.removeFromGroup = removeFromGroup;
const addToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, userId } = req.body;
        const addUser = yield ChatModel_1.chat
            .findByIdAndUpdate(chatId, {
            $push: { users: userId },
        }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!addUser)
            return res.status(400).json({ message: "chat not found" });
        return res.status(200).json(addUser);
    }
    catch (err) {
        console.log(err);
    }
});
exports.addToGroup = addToGroup;
