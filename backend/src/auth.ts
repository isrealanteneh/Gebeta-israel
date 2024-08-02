import Router from "express";
import { AppDataSource } from "./data-source";
import { Player } from "./entity/Player";
import { error } from "console";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const authRouter = Router();

export default authRouter.post("", async (req, res) => {
  const { username, password } = req.body;
  try {
    const playersData = await AppDataSource.manager.findOne(Player, {
      where: { username: username, password: password },
    });
    if (playersData != null) {
      // create object for the payload data
      let payload = {
        id: playersData.id,
        name: playersData.username,
      };
      const secretkey = process.env.SECRETKEY;
      const expiresIn = { expiresIn: "1h" };

      const token = jwt.sign(payload, secretkey, expiresIn);
      res
        .cookie("userToken", token, { httpOnly: true, secure: true })
        .redirect("/game");
      res.end();
    } else {
      res.json("user not found");
    }
  } catch (err) {
    res.json({ msg: error });
  }
});
