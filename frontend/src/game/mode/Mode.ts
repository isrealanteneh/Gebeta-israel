import Gebeta from "../Gebeta";

abstract class GameMode {
    gebeta: Gebeta;
    constructor(gebeta: Gebeta) {
        this.gebeta = gebeta;
    }

    abstract start(): void;
    abstract update(): void;
}

export default GameMode;