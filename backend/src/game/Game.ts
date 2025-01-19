import { Player } from "./Player";

interface IGame {
    challenger: {
        id: string,
        username: string,
        name: string,
        cupture: number
    },
    challengee: {
        id: string,
        username: string,
        name: string,
        cupture: number
    },
    status: string,
    moves: Array<number>,
    winner: {
        id: string,
        score: number
    }
}

export type { IGame };