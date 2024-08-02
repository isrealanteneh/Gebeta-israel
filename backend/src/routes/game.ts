import { Router } from "express";

const gameRoute = Router();

export default gameRoute.get("", (req, res) => {
  res.json("Game route");
});
