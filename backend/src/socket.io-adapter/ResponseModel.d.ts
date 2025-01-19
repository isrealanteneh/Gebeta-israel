declare interface GameState {
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
        move: [],
    }
}

export enum GameModeType {
    LM = 'lamie-weled',
    // Add more game modes here and it is unique
    // Make sure to add a case in the switch statement in ModeFactory.create
}

export { GameState }