import { Response, NextFunction, Request } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv";
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;

    const JWT_SECRET = process.env.JWT_SECRET || "";
    if (token) {
      token = token.split(" ")[1];
      const user = jwt.verify(token, JWT_SECRET as string);
      res.locals.user = user;
      next();
    } else {
      return res.status(400).json({ message: "you are Not auth" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};
