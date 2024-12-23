import { Router } from "express";
import authUser from "../auth/middleware/http.auth";
import { ActiveUserStore } from "../database/inmemory";
import { Response as ReturnModel, Status } from "./Response";

const playerRoute = Router();

playerRoute.get("/players/active", authUser, (req, res) => {
    const activeUserStore: ActiveUserStore = ActiveUserStore.getInstance();

    console.log(activeUserStore.getAllUsers())

    res.status(200).json(
        new ReturnModel(
            Status.SUCCESS,
            `User logged in successfully.`,
            200,
            activeUserStore.getAllUsers()
        )
    )

});

export default playerRoute;