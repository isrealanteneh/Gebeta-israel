import { Request, Response, Router } from "express";
import { Response as ReturnModel, Status } from "./Response";
import { ActiveUserStore } from "../database/inmemory";
import UserModel from "../database/models/User";

const homeRoute = Router()

homeRoute.get('/search', async (req: Request, res: Response) => {
    const activeUserStore: ActiveUserStore = ActiveUserStore.getInstance();
    console.log(activeUserStore.getAllUsers())

})

export default homeRoute;