import Gebeta from "../Gebeta";
import { GameModeType } from "./ModeFactory";

interface GameState {
    gameId: string,
    challenger: {
        id: string,
        name: string,
        username: string,
        cupture: number
    },
    challengee: {
        id: string,
        name: string,
        username: string,
        cupture: number
    },
    gameMode: GameModeType,
    gameStatus: {
        turn: string,
        move: number[],
    }
}

interface ThisPlayer {
    name: "Unknown",
    id: "no-id",
    username: "@unknown"
}

abstract class GameMode {
    gebeta: Gebeta;
    gameState: GameState = {} as GameState
    thisPlayer: ThisPlayer = {} as ThisPlayer

    constructor(gebeta: Gebeta) {
        this.gebeta = gebeta;
    }

    abstract start(): void;
    abstract update(): void;
    abstract setPlayer(user: ThisPlayer): void;
    abstract setGameState(gameState: GameState): void;
}

export type { ThisPlayer, GameState }

export default GameMode;