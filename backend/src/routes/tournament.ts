import { Router } from "express";
import authUser from "../auth/middleware/http.auth";

const tournamentRoute = Router();

tournamentRoute.get("/tournaments/active", authUser, (req, res) => {
  res.json("Active Tournament");
});


export default tournamentRoute;