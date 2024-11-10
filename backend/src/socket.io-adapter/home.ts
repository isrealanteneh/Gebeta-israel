import { Server, Socket } from "socket.io";
import { authPlayer } from "../auth/middleware/socket.io";
import { ActiveGames, ActiveUserStore, } from "../database/inmemory";
import GameModel from "../database/models/Game";;

const home = (ioServer: Server) => {
    const ioHome = ioServer.of('/home')
    ioHome.use(authPlayer);

    ioHome.on('connect', (socket: any) => {
        const activeUserStore: ActiveUserStore = ActiveUserStore.getInstance();
        activeUserStore.addUser(socket.user.id, {
            id: socket.user.id,
            isActive: true,
            name: socket.user.f_name + ' ' + socket.user.l_name,
            username: socket.user.username,
            socketId: socket.id
        });

        socket.on('challenge', (msg: any, callback: any) => {
            const socketId = activeUserStore.getUser(msg.challengee)?.socketId
            if (socketId) {
                socket.to(socketId).emit('challenge:incoming',
                    {
                        challenger: {
                            id: socket.user.id,
                            username: socket.user.username,
                            f_name: socket.user.f_name,
                            l_name: socket.user.l_name,
                        },
                        challengee: msg.challengee
                    },
                    (acknowledged: any) => {
                        callback(acknowledged);
                    })
            } else {
                callback(false)
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

        socket.on('', (socket: any) => {

        })

        socket.on('disconnect', (reason: any) => {
            activeUserStore.removeUser(socket.user.id);
            console.log("User removed", activeUserStore.getAllUsers());
        })
    })
}

export default home;