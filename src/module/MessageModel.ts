import mongoose, { Schema, model } from "mongoose";
export interface UMessage extends Document {
  sender: string;
  content: string;
  chat: string;
}
const messageSchema: any = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const Message = model<UMessage>("Message", messageSchema);
