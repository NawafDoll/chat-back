import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rePassword: { type: String, required: false },
    pic: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const user = model("user", userSchema);
