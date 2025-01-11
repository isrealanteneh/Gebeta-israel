import { Server, Socket } from "socket.io";
import { authPlayer } from "../auth/middleware/socket.io";
import { ActiveGames, ActiveUserStore, } from "../database/inmemory";
import GameModel from "../database/models/Game"; import { IGame } from "../game/Game";
;

const home = (ioServer: Server) => {

    ioServer.use(authPlayer);

    ioServer.on('connect', (socket: any) => {
        const activeUserStore: ActiveUserStore = ActiveUserStore.getInstance();
        const user = {
            id: socket.user.id,
            isActive: true,
            name: `${socket.user.f_name} ${socket.user.l_name}`,
            username: socket.user.username,
            socketId: socket.id
        };

        activeUserStore.addUser(user.id, user);

        ioServer.emit('user-went-online', {
            id: user.id,
            isActive: user.isActive,
            name: user.name,
            username: user.username,
        });

        socket.on('challenge', (msg: any) => {
            const challengee = activeUserStore.getUser(msg.challengee.id);

            if (challengee) {
                socket.to(challengee.socketId).emit('challenge:incoming', {
                    challenger: {
                        id: socket.user.id,
                        username: socket.user.username,
                        name: `${socket.user.f_name} ${socket.user.l_name}`,
                    },
                    challengee: {
                        id: challengee.id,
                        username: challengee.username,
                        name: challengee.name
                    }
                });
            } else {
                socket.emit('challenge:faild', {
                    challenge: msg,
                    msg: "Could not find challengee."
                });
            }
        });

        socket.on('challenge:accepted', async (msg: any) => {
            const activeChallenger = activeUserStore.getUser(msg.challenger.id)
            const activeChallengee = activeUserStore.getUser(msg.challengee.id)
            if (activeChallengee && activeChallenger) {
                const game = new GameModel({
                    challenger: {
                        id: msg.challenger.id,
                        username: msg.challenger.username,
                        name: msg.challenger.name
                    },
                    challengee: {
                        id: msg.challengee.id,
                        username: msg.challengee.username,
                        name: msg.challengee.name
                    },
                    status: "pending",
                    moves: [],
                    winner: null
                });

                await game.save();

                const activeGames: ActiveGames = ActiveGames.getInstance();
                activeGames.addGame(game.id, {} as IGame);

                ioServer.to(activeChallenger.socketId).to(activeChallengee.socketId).emit('game:start', {
                    gameId: game.id,
                    challenger: msg.challenger,
                    challengee: msg.challengee,
                    gameStatus: {
                        turn: msg.challenger.id,
                        move: null,
                    }
                });
            }
        })

        socket.on('challenge:rejected', (msg: any, callback: any) => {
            console.log(msg)
        })


        socket.on('game:start', (gameId) => {

        })

        // socket.on('', (socket: any) => {

        // })

        socket.on('disconnect', (reason: any) => {
            ioServer.emit('user-went-offline', socket.user.id);
            activeUserStore.removeUser(socket.user.id);

            console.log("User removed", socket.user);
        })
    })
}

export default home;