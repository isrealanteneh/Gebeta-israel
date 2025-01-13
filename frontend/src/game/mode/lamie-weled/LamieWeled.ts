import Gebeta from "../../Gebeta";
import Pit from "../../Pit";
import GameMode from "../Mode";

class LamieWeled extends GameMode {
    update(): void {
        requestAnimationFrame(this.gebeta.update.bind(this.gebeta));
    }

    start(): void {
        console.log('Gebeta Game started in Lamie-Weled Mode');
        this.gebeta.start();
    }

    constructor(gebeta: Gebeta) {
        super(gebeta);
        this.registerHooks();
    }

    registerHooks(): void {
        this.gebeta.takeFunction = this.takeFunction;
        this.gebeta.beforeTakeHook = this.beforeTakeHook;
        this.gebeta.landedOnEmptyPitHook = this.landedOnEmptyPitHook;
        this.gebeta.landedOnNonEmptyPitHook = this.landedOnNonEmptyPitHook;
    }

    private takeFunction(stoneCount: number): number {
        return stoneCount;
    }

    private beforeTakeHook(takePit: Pit): boolean {
        console.log('Before Take Hook');
        console.log("Pit: ", takePit.whichPit());
        console.log("Stone Count: ", takePit.getStones().length);


        return true;
    }

    private landedOnEmptyPitHook(emptyPit: Pit): void {
        console.log('Landed On Empty Pit Hook');
        console.log("Pit: ", emptyPit.whichPit());
        console.log("Stone Count: ", emptyPit.getStones().length);

        return undefined;
    }

    private landedOnNonEmptyPitHook(nonEmptyPit: Pit): boolean {
        console.log('Landed On Non Empty Pit Hook');
        console.log("Pit: ", nonEmptyPit.whichPit());
        console.log("Stone Count: ", nonEmptyPit.getStones().length);
        return true;
    }

}

export default LamieWeled;