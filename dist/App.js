"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const DB_1 = require("./config/DB");
const UserRouter_1 = require("./routers/UserRouter");
const dotenv_1 = __importDefault(require("dotenv"));
const ChatRouter_1 = require("./routers/ChatRouter");
const MessageRouter_1 = require("./routers/MessageRouter");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: "https://chat-axjv.onrender.com",
    methods: [
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
// const port = ;
// const server = http.createServer(app);
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
(0, DB_1.connectDB)();
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://chay.onrender.com");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
const dirname = path_1.default.resolve();
app.use(express_1.default.static(path_1.default.join(__dirname, "/my-app/build")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "my-app", "build", "index.html"));
});
app.use("/user", UserRouter_1.userRouter);
app.use("/chat", ChatRouter_1.chatRouter);
app.use("/message", MessageRouter_1.messageRouter);
// const server = http.createServer(app);
const server = app.listen(process.env.PORT || 4436, () => console.log("Server Running"));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://chat-axjv.onrender.com",
        methods: [
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, DELETE",
        ],
    },
});
io.on("connection", (socket) => {
    console.log("Connected to sockit.io");
    socket.on("setup", (userData) => {
        socket.join(userData.id);
        console.log(userData);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users)
            return console.log("chat.users are not defined");
        chat.users.forEach((u) => {
            if (u._id === newMessageRecieved.sender)
                return;
            socket.in(u._id).emit("message recieved", newMessageRecieved);
        });
    });
    //   socket.on("disconnect", () => {
    //     console.log("user disconnect");
    //   });
});
