import express from "express";
import cors from "cors";
import { connectDB } from "./config/DB";
import { userRouter } from "./routers/UserRouter";
import dotenv from "dotenv";
import { chatRouter } from "./routers/ChatRouter";
import { messageRouter } from "./routers/MessageRouter";
import { Server } from "socket.io";
import http from "http";
import path from "path";
const app = express();
dotenv.config();
app.use(
  cors({
    origin: "https://chat-axjv.onrender.com",
    methods: [
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE",
    ],
    credentials: true,
  })
);
app.use(express.json());
// const port = ;
// const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
connectDB();

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

// const server = http.createServer(app);

const dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/my-app/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "my-app", "build", "index.html"));
});

app.get("*", (request, res) => {
  res.sendFile(path.join(__dirname, "uploads/"));
});

const server = app.listen(process.env.PORT || 4436, () =>
  console.log("Server Running")
);

const io = new Server(server, {
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

  socket.on("setup", (userData: any) => {
    socket.join(userData.id);
    console.log(userData);
    socket.emit("connected");
  });

  socket.on("join chat", (room: any) => {
    socket.join(room);
    console.log("user joined room " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users are not defined");

    chat.users.forEach((u: any) => {
      if (u._id === newMessageRecieved.sender) return;
      socket.in(u._id).emit("message recieved", newMessageRecieved);
    });
  });
  //   socket.on("disconnect", () => {
  //     console.log("user disconnect");
  //   });
});
