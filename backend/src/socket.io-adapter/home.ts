import { Server, Socket } from "socket.io";
import { authPlayer } from "../auth/middleware/socket.io";
import { ActiveGames, ActiveUserStore, } from "../database/inmemory";
import GameModel from "../database/models/Game";;

const home = (ioServer: Server) => {

    ioServer.use(authPlayer);

    ioServer.on('connect', (socket: any) => {
        const activeUserStore: ActiveUserStore = ActiveUserStore.getInstance();
        activeUserStore.addUser(socket.user.id, {
            id: socket.user.id,
            isActive: true,
            name: socket.user.f_name + ' ' + socket.user.l_name,
            username: socket.user.username,
            socketId: socket.id
        });

        ioServer.emit('user-went-online', {
            id: socket.user.id,
            isActive: true,
            name: socket.user.f_name + ' ' + socket.user.l_name,
            username: socket.user.username,
        })

        socket.on('challenge', (msg: any) => {
            const challengee = activeUserStore.getUser(msg.challengee.id)//?.socketId

            if (challengee && false) {
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
                })
            }
        })

        socket.on('challenge:accepted', async (msg: any, callback: any) => {
            const activeUser = activeUserStore.getUser(msg.challenger.id)
            if (activeUser) {
                // const game = await GameModel.create({
                //     players: [activeUser.id, socket.user.id]
                // });

                // if (game) {
                //     const activeGames = ActiveGames.getInstance();

                //     const player1 = new Player(activeUser.id);
                //     const player2 = new Player(socket.user.id);
                //     const newGame = new Game([player1, player2]);
                //     newGame.start();
                //     activeGames.addGame(game._id.toString(), newGame);

                //     socket.to(activeUser.socketId).emit('challenge:accepted', {
                //         challenger: msg.challenger,
                //         challengee: {
                //             id: socket.user.id,
                //             username: socket.user.username,
                //             f_name: socket.user.f_name,
                //             l_name: socket.user.l_name,
                //         },
                //         gameId: game._id.toString()
                //     })

                //     socket.emit('challenge:accepted', {
                //         challenger: msg.challenger,
                //         challengee: {
                //             id: socket.user.id,
                //             username: socket.user.username,
                //             f_name: socket.user.f_name,
                //             l_name: socket.user.l_name,
                //         },
                //         gameId: game._id.toString()
                //     })
                // }
            }
        })

        socket.on('challenge:rejected', (msg: any, callback: any) => {
            console.log(msg)
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