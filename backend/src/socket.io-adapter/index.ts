import { Server } from "socket.io";
import home from "./home";

function init(ioServer: Server) {

    ioServer.on('connect', (data) => {
        console.log('user - connected')
    })

    ioServer.on('disconnect', (data) => {
        console.log('user - disconnected')
    })

    home(ioServer);
}

export default init;