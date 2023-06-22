import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Message } from "../module/MessageModel";
import { user } from "../module/UsersModule";
import { chat } from "../module/ChatModel";
import { cloudinary } from "../middleware/Claudinary";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, chatId }: any = req.body;
    let token: any = req.headers.authorization;
    token = token.split(" ")[1];
    const user_id: any = jwt.decode(token);

    if (!chatId) {
      return res
        .status(400)
        .json({ message: "Invalid data passed into requist" });
    }

    var newMessage: any = {
      sender: user_id.id,
      content: content,
      chat: chatId,
    };
    var message: any = await Message.create(newMessage);
    message = await message.populate("sender", "username pic email ");
    message = await message.populate("chat");
    message = await user.populate(message, {
      path: "chat.users",
      select: "username pic emeil",
    });
    await chat.findByIdAndUpdate(req.body.chat, {
      lastestMessage: message,
    });
    return res.json(message);
  } catch (err) {
    console.log(err);
  }
};

export const sendfile = async (req: Request, res: Response) => {
  try {
    const { content, chatId }: any = req.body;
    const { image } = req.body;
    let token: any = req.headers.authorization;
    token = token.split(" ")[1];
    const user_id: any = jwt.decode(token);

    // if (!content || !chatId) {
    //   return res
    //     .status(400)
    //     .json({ message: "Invalid data passed into requist" });
    // }
    const result: any = await cloudinary.v2.uploader.upload(image, {
      folder: "products",
      format: "pdf",
      transformation: {
        width: 400,
        Height: 600,
        crop: "limit",
      },
    });
    var newMessage: any = {
      sender: user_id.id,
      content: "imagefromUploads",
      chat: chatId,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };
    var message: any = await Message.create(newMessage);
    message = await message.populate("sender", "username pic email ");
    message = await message.populate("chat");
    message = await user.populate(message, {
      path: "chat.users",
      select: "username pic emeil",
    });
    await chat.findByIdAndUpdate(req.body.chat, {
      lastestMessage: message,
    });
    return res.json(message);
  } catch (err) {
    console.log(err);
  }
};

export const allMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username pic email")
      .populate("chat");

    res.json(messages);
  } catch (err) {
    console.log(err);
  }
};
