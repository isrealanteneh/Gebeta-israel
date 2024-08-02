import { Request, Response, NextFunction, response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export default async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookie = req.headers.cookie;
    const token = cookie.split("=")[1];
    const verifyToken = jwt.verify(
      token,
      process.env.SECRETKEY,
      (err, response) => {
        if (!err) {
          next();
        } else {
          throw new Error();
        }
      }
    );
  } catch (err) {
    res.json({ Msg: `Please sign up first` });
  }
}
