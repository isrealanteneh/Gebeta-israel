import { Router } from "express";
import authUser from "../auth/middleware/http.auth";
import { ActiveUserStore } from "../database/inmemory";
import { Response as ReturnModel, Status } from "./Response";

const playerRoute = Router();

playerRoute.get("/players/active", authUser, (req, res) => {
  const activeUserStore: ActiveUserStore = ActiveUserStore.getInstance();

  console.log(activeUserStore.getAllUsers());

  res
    .status(200)
    .json(
      new ReturnModel(
        Status.SUCCESS,
        `Active user list.`,
        200,
        activeUserStore.getAllUsers()
      )
    );
});

// playerRoute.get("/search", authUser, (req, res) => {
//   const { search } = req.query;

//   if (!search) {
//     return res
//       .status(400)
//       .json(
//         new ReturnModel(Status.ERROR, `Search query must be provided.`, 400, [])
//       );
//   }

//   const activeUserStore: ActiveUserStore = ActiveUserStore.getInstance();

//   const searchedUsers = activeUserStore
//     .getAllUsers()
//     .filter(
//       (user) =>
//         user.name.includes(search.toString()) ||
//         user.username.includes(search.toString())
//     );

//   res
//     .status(200)
//     .json(
//       new ReturnModel(
//         Status.SUCCESS,
//         `Active user search list.`,
//         200,
//         searchedUsers
//       )
//     );
// });

export default playerRoute;
