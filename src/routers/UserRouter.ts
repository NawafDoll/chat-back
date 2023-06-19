import express from "express";
import {
  editPass,
  getUser,
  login,
  register,
  resetPass,
  searchUser,
} from "../controllers/UsersController";
import validate from "../middleware/Validate";
import {
  editPassZodSchema,
  loginZodSchema,
  registerZodSchema,
  resetPassZodSchema,
} from "../zodSchema/UsersZod";
import { protect } from "../middleware/Protected";
import { Upload } from "../middleware/upload";
// import { upload } from "../middleware/upload";
// import { upload } from "../middleware/Upload";

const userRouter = express.Router();

userRouter.post("/register", validate(registerZodSchema), register);
userRouter.post("/login", validate(loginZodSchema), login);
userRouter.post("/resetpass", validate(resetPassZodSchema), resetPass);
userRouter.post("/editpass/:id/:token", validate(editPassZodSchema), editPass);
userRouter.get("/", protect, searchUser);
userRouter.get("/:id", getUser);
export { userRouter };
