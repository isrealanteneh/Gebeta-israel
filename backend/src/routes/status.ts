import { Request, Response, Router } from "express";
import authUser from "../auth/middleware/http.auth";
import { Response as ReturnModel, Status } from "./Response";
import { ActiveUserStore } from "../database/inmemory";

const statusRoute = Router();

statusRoute.get('/active/bets', authUser, (req: any, res: Response) => {
    // console.log(req['user']);

    const activeBets = [
        {
            id: 3,
            isActive: true,
            date: new Date().toUTCString(),
            coin: 10,
            activeUsers: 2
        },
        {
            id: 23,
            isActive: true,
            date: new Date().toUTCString(),
            coin: 5,
            activeUsers: 3
        }
    ]

    res.status(200).json(
        new ReturnModel(
            Status.SUCCESS,
            'Active bets successfully fetched.',
            200,
            activeBets
        )
    )
})

statusRoute.get('/active/players', authUser, (req: any, res: Response) => {
    const activeUserStore = ActiveUserStore.getInstance();

    res.status(200).json(
        new ReturnModel(
            Status.SUCCESS,
            'Active player successfully fetched.',
            200,
            activeUserStore.getAllUsers()
        )
    )
})

export default statusRoute;