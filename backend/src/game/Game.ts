import { Player } from "./Player";

interface IGame {
    gameId: string;
    players: Array<Player>;
    winner: Player | null;
    moves: Array<string>;
    status: string;
}

export type { IGame };