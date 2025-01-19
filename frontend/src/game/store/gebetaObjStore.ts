import Gebeta from "../Gebeta";
import GameMode, { GameState } from "../mode/Mode";

class GebetaGame {
    private gebeta: Gebeta | undefined
    private static INSTANCE: GebetaGame | null = null;
    private gameMode: GameMode | null = null;

    getGebeta(): Gebeta | undefined {
        return this.gebeta;
    }

    setGebeta(gebeta: Gebeta) {
        this.gebeta = gebeta;
    }

    setGameMode(gameMode: GameMode) {
        this.gameMode = gameMode;
    }

    getGameMode() {
        return this.gameMode;
    }

    static getInstance() {
        if (!GebetaGame.INSTANCE)
            GebetaGame.INSTANCE = new GebetaGame();

        return GebetaGame.INSTANCE;
    }
}

export default GebetaGame;