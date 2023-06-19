import { Request, Response } from "express";
import { user } from "../module/UsersModule";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { cloudinary } from "../middleware/Claudinary";
export const register = async (req: Request, res: Response) => {
  try {
    const { pic } = req.body;

    const findUserByEmail = await user.findOne({ email: req.body.email });
    const findUserByPhone = await user.findOne({ phone: req.body.phone });
    if (findUserByEmail || findUserByPhone)
      return res
        .status(400)
        .json({ message: "هذا الحساب مسجل سابقا بالايميل او رقم الجوال" });
    const findUserByUsername = await user.findOne({
      username: req.body.username,
    });
    if (findUserByUsername)
      return res
        .status(400)
        .json({ message: "هذا الاسم مستخدم من قبل مستخدم اخر" });
    const hashPass = await bcrypt.hash(req.body.password, 10);
    const result: any = await cloudinary.v2.uploader.upload(pic, {
      folder: "products",
    });
    const newUser = await user.create({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hashPass,
      pic: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    if (newUser) return res.status(200).json({ message: "Create Account" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const checkEmail = await user.findOne({ email: email });
    if (!checkEmail)
      return res.status(400).json({ message: "هذا الحساب غير مسجل" });
    const checkPassword = await bcrypt.compare(password, checkEmail.password);
    if (!checkPassword)
      return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
    const token = jwt.sign(
      {
        id: checkEmail._id,
        username: checkEmail.username,
        email: checkEmail.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      message: `Welcome ${checkEmail.username}`,
      token,
      id: checkEmail.id,
      username: checkEmail.username,
      email: checkEmail.email,
      pic: checkEmail.pic?.url,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const resetPass = async (req: Request, res: Response) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nawaf.taalat.gpt@gmail.com",
        pass: "npzdwcjbbmnrphqi",
      },
    });
    const email = req.body.email;
    const findUser = await user.findOne({ email: email });
    if (!findUser)
      return res.status(400).json({ message: "هذا الحساب غير موجود" });
    const secret = "secret" + findUser.password;
    const token = jwt.sign({ id: findUser.id, email: findUser.email }, secret, {
      expiresIn: "1d",
    });
    const link = `http://localhost:3000/user/editpass/${findUser.id}/${token}`;
    const mailOptions = {
      from: "",
      to: findUser.email,
      subject: "تحديث كلمة المرور",
      text: link,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({ message: "أفحص بريدك الالكتروني" });
      }
    });

    return res
      .status(200)
      .json({ resetPass: link, message: "أفحص بريدك الالكتروني" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const editPass = async (req: Request, res: Response) => {
  try {
    const { id, token } = req.params;
    const password = req.body.password;
    const findUser = await user.findById({ _id: id });
    if (!findUser) {
      return res.status(400).json({ message: "There is wrong" });
    }
    const pass = await bcrypt.hash(password, 10);
    await user.findByIdAndUpdate(id, { password: pass });
    res.status(200).json({ message: "Changed Password" });
  } catch (err) {
    console.log(err);
  }
};

export const searchUser = async (req: Request, res: Response) => {
  try {
    const search: any = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    let token: any = req.headers.authorization;
    token = token.split(" ")[1];
    const userId: any = jwt.decode(token);

    const users = (await user.find(search)).filter((us) => us.id !== userId.id);

    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params._id;

  const findUser = await user.findById(req.params.id);
  if (!findUser) {
    return res.status(400).json("user not found");
  }
  return res.status(200).json(findUser);
};
