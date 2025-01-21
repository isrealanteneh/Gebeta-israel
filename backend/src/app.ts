import express from 'express';
import cors from 'cors';
import whitelist from './origin-whitelist.json';
import { config } from 'dotenv';
import { Server } from 'socket.io';
import init from './socket.io-adapter';
import authRoute from './routes/auth';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import playerRoute from './routes/players';
import tournamentRoute from './routes/tournament';
import gameRoute from './routes/game';

config();
const app = express();

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (whitelist.origins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

app.set('views', [__dirname, 'views'].join(path.sep));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(authRoute);
app.use(playerRoute);
app.use(tournamentRoute);
app.use(gameRoute);

const host: string = process.env.HOST || 'localhost';
const port: number = parseInt(process.env.PORT || '3000');
const mongoUri: string = process.env.MONGO_CONN || 'mongodb://127.0.0.1:27017/Gebeta';

(async () => {
    try {
        const mongoDb = await mongoose.connect(mongoUri)

        if (mongoDb) console.log(`Mongo DB connected successfully. ${mongoUri}`);

        const server = app.listen(port, host, () => {
            console.log(`Server started on http://${host}:${port}`);
        })

        const socketIoServer: Server = new Server(server, {
            cors: {
                origin: whitelist.origins
            }
        });

        init(socketIoServer);

    } catch (error) {
        console.log(`Mongo DB connection error. ${error}`)
    }
})();