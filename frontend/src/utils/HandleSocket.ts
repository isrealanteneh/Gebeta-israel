import { Socket } from "socket.io-client";

import { Player } from "./ActiveEntities";
import state from "./StateManagement";
import { handleUnauthorizedError } from "./HandleUnauthorizedError";
import { Notification } from "../components/NotifyFaildProcess";
import { IncomingRequest } from "../components/IncomingReq";

export function setupSocketHandlers(socketClient: Socket, appContainer: HTMLDivElement) {
    socketClient.on('user-went-offline', (playerId: string) => {
        state.removePlayer(playerId);
    });

    socketClient.on('user-went-online', (player: Player) => {
        if (player.id != state.user.id) {
            state.addPlayer(player);
        }
    });

    socketClient.on('challenge:faild', (reason: { challenge: any, msg: string }) => {
        const faildReqToPlayer = reason.challenge.challengee;
        Notification("Request Failed!", `${reason.msg} <br> Request to ${faildReqToPlayer.name} failed.`, appContainer);
    });

    socketClient.on('challenge:incoming', (challenge: any) => {
        IncomingRequest("Incoming Challenge", `<b>${challenge.challenger.name}</b> has challenged you to ${challenge.gameMode} game.`, appContainer,
            () => {
                socketClient.emit('challenge:accepted', challenge);
            },
            () => {
                socketClient.emit('challenge:rejected', challenge);
            });
    });

    socketClient.on('game:start', (game: any) => {
        state.setGame(game);
        state.setPage('game');
        console.log("Game Started", state.game);
    });

    socketClient.on('disconnect', (reason, desc) => console.log("reason", reason, "desc", desc));

    socketClient.on('connect_error', async (ex) => {
        if (ex.message.includes('unauthorized')) {
            await handleUnauthorizedError(ex);
        }
        console.log("EX,", ex);
    });
}