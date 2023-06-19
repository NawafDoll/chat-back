import { Request, Response } from "express";
import { chat } from "../module/ChatModel";
import { user } from "../module/UsersModule";
import jwt, { JwtPayload } from "jsonwebtoken";
interface Token {
  id: string;
}
export const accessChat = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    let token: any = req.headers.authorization;
    token = token.split(" ")[1];
    const user_id: any = jwt.decode(token);
    var isChat: any = await chat
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: user_id.id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await user.populate(isChat, {
      path: "latestMessage.sender",
      select: "username pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData: any = {
        chatName: "sender",
        isGroupChat: false,
        users: [user_id.id, userId],
      };
    }

    const createdChat = await chat.create(chatData);
    const FullChat = await chat
      .findOne({ _id: createdChat.id })
      .populate("users", "-password");
    res.status(200).json(FullChat);
  } catch (err) {
    console.log(err);
  }
};

export const fetchChats = async (req: Request, res: Response) => {
  try {
    let token: any = req.headers.authorization;
    token = token.split(" ")[1];
    const user_id: any = jwt.decode(token);
    chat
      .find({ users: { $elemMatch: { $eq: user_id.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastestMessage")
      .sort({ updateAt: -1 })
      .then(async (results: any) => {
        results = await user.populate(results, {
          path: "lastestMessage.sender",
          select: "username pic email",
        });
        return res.status(200).json(results);
      });
  } catch (err) {
    console.log(err);
  }
};

export const createGroupChat = async (req: Request, res: Response) => {
  let token: any = req.headers.authorization;
  token = token.split(" ")[1];
  const user_id: any = jwt.decode(token);
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
    const groupChat = await chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.body.user,
    });
    const fullGroupChat = await chat
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (err) {
    console.log(err);
  }
};

export const renameGroup = async (req: Request, res: Response) => {
  try {
    const { chatId, chatName } = req.body;
    const updateChat = await chat
      .findByIdAndUpdate(
        chatId,
        {
          chatName,
        },
        {
          new: true,
        }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updateChat) return res.status(400).json({ message: "chat not found" });
    return res.status(200).json(updateChat);
  } catch (err) {
    console.log(err);
  }
};

export const removeFromGroup = async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.body;
    const deleteUser = await chat
      .findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!deleteUser) return res.status(400).json({ message: "chat not found" });
    return res.status(200).json(deleteUser);
  } catch (err) {
    console.log(err);
  }
};

export const addToGroup = async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.body;
    const addUser = await chat
      .findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!addUser) return res.status(400).json({ message: "chat not found" });
    return res.status(200).json(addUser);
  } catch (err) {
    console.log(err);
  }
};
