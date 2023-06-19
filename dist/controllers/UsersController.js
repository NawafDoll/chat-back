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
exports.getUser = exports.searchUser = exports.editPass = exports.resetPass = exports.login = exports.register = void 0;
const UsersModule_1 = require("../module/UsersModule");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const Claudinary_1 = require("../middleware/Claudinary");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pic } = req.body;
        const findUserByEmail = yield UsersModule_1.user.findOne({ email: req.body.email });
        const findUserByPhone = yield UsersModule_1.user.findOne({ phone: req.body.phone });
        if (findUserByEmail || findUserByPhone)
            return res
                .status(400)
                .json({ message: "هذا الحساب مسجل سابقا بالايميل او رقم الجوال" });
        const findUserByUsername = yield UsersModule_1.user.findOne({
            username: req.body.username,
        });
        if (findUserByUsername)
            return res
                .status(400)
                .json({ message: "هذا الاسم مستخدم من قبل مستخدم اخر" });
        const hashPass = yield bcrypt_1.default.hash(req.body.password, 10);
        const result = yield Claudinary_1.cloudinary.v2.uploader.upload(pic, {
            folder: "products",
        });
        const newUser = yield UsersModule_1.user.create({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: hashPass,
            pic: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });
        if (newUser)
            return res.status(200).json({ message: "Create Account" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const checkEmail = yield UsersModule_1.user.findOne({ email: email });
        if (!checkEmail)
            return res.status(400).json({ message: "هذا الحساب غير مسجل" });
        const checkPassword = yield bcrypt_1.default.compare(password, checkEmail.password);
        if (!checkPassword)
            return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
        const token = jsonwebtoken_1.default.sign({
            id: checkEmail._id,
            username: checkEmail.username,
            email: checkEmail.email,
        }, process.env.JWT_SECRET, { expiresIn: "24h" });
        return res.status(200).json({
            message: `Welcome ${checkEmail.username}`,
            token,
            id: checkEmail.id,
            username: checkEmail.username,
            email: checkEmail.email,
            pic: checkEmail.pic,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
});
exports.login = login;
const resetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "nawaf.taalat.gpt@gmail.com",
                pass: "npzdwcjbbmnrphqi",
            },
        });
        const email = req.body.email;
        const findUser = yield UsersModule_1.user.findOne({ email: email });
        if (!findUser)
            return res.status(400).json({ message: "هذا الحساب غير موجود" });
        const secret = "secret" + findUser.password;
        const token = jsonwebtoken_1.default.sign({ id: findUser.id, email: findUser.email }, secret, {
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
            }
            else {
                return res.status(200).json({ message: "أفحص بريدك الالكتروني" });
            }
        });
        return res
            .status(200)
            .json({ resetPass: link, message: "أفحص بريدك الالكتروني" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
});
exports.resetPass = resetPass;
const editPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, token } = req.params;
        const password = req.body.password;
        const findUser = yield UsersModule_1.user.findById({ _id: id });
        if (!findUser) {
            return res.status(400).json({ message: "There is wrong" });
        }
        const pass = yield bcrypt_1.default.hash(password, 10);
        yield UsersModule_1.user.findByIdAndUpdate(id, { password: pass });
        res.status(200).json({ message: "Changed Password" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.editPass = editPass;
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.search
            ? {
                $or: [
                    { username: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        const userId = jsonwebtoken_1.default.decode(token);
        const users = (yield UsersModule_1.user.find(search)).filter((us) => us.id !== userId.id);
        res.json(users);
    }
    catch (err) {
        console.log(err);
    }
});
exports.searchUser = searchUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params._id;
    const findUser = yield UsersModule_1.user.findById(req.params.id);
    if (!findUser) {
        return res.status(400).json("user not found");
    }
    return res.status(200).json(findUser);
});
exports.getUser = getUser;
