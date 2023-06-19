import mongoose, { connect, ConnectOptions } from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    const url = process.env.MONGO_URL || "";
    await connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("DB is Connected!");
  } catch (err) {
    console.log("DB Error");
    process.exit(1);
  }
};
