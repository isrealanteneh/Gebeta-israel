import { Router } from "express";
import authUser from "../auth/middleware/http.auth";
import { Response as ReturnModel, Status } from "./Response";
import GameModel from "../database/models/Game";
const gameRoute = Router();

gameRoute.get("/game/history", authUser, async (req: any, res: any) => {

	try {
		const userId = req.user.id;
		console.log("Game History: ", userId)
		const gameHistory = await GameModel.find({
			$or: [
				{ "challenger.id": userId },
				{ "challengee.id": userId }
			]
		});

		if (!gameHistory) {
			return res.status(404).json("No game history found");
		}
		res.status(200).json(new ReturnModel(Status.SUCCESS, "Game history fetched successfully", 200, gameHistory));

	} catch (error) {
		res.status(500).json(new ReturnModel(Status.ERROR, "An error occurred while fetching game history", 500, error));

	}

});


export default gameRoute;
