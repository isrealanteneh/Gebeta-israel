import Gebeta from "../Gebeta";
import LamieWeled from "./lamie-weled/LamieWeled";
import GameMode from "./Mode";

class ModeFactory {
    static create(mode: GameModeType, gebeta: Gebeta): GameMode {
        switch (mode) {
            case 'lamie-weled':
                return new LamieWeled(gebeta);
            default:
                throw new Error('Invalid game mode');
        }
    }
}

export enum GameModeType {
    LM = 'lamie-weled',
    // Add more game modes here and it is unique
    // Make sure to add a case in the switch statement in ModeFactory.create
}

export default ModeFactory;