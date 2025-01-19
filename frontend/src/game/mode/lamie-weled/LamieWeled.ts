import { Notification as FaildNotify, Notification as SuccessNotify } from "../../../components/NotifyFaildProcess";
import { socketClient } from "../../../utils/Network";
import Gebeta from "../../Gebeta";
import Pit from "../../Pit";
import GameMode, { GameState, ThisPlayer } from "../Mode";


class LamieWeled extends GameMode {
    appContainer: HTMLDivElement;

    constructor(gebeta: Gebeta) {
        super(gebeta);
        this.registerHooks();
        this.appContainer = document.querySelector('#app') as HTMLDivElement;
    }

    setPlayer(thisPlayer: ThisPlayer): void {
        console.log("setPlayer", thisPlayer)
        this.thisPlayer = thisPlayer
    }

    setGameState(gameState: GameState): void {
        console.log("setGameState", gameState);
        this.gameState = gameState;
    }

    update(): void {
        requestAnimationFrame(this.gebeta.update.bind(this.gebeta));
    }

    start(): void {
        console.log('Gebeta Game started in Lamie-Weled Mode');
        this.gebeta.start();
    }

    registerHooks(): void {
        this.gebeta.takeFunction = this.takeFunction.bind(this);
        this.gebeta.beforeTakeHook = this.beforeTakeHook.bind(this);
        this.gebeta.landedOnEmptyPitHook = this.landedOnEmptyPitHook.bind(this);
        this.gebeta.landedOnNonEmptyPitHook = this.landedOnNonEmptyPitHook.bind(this);
        this.gebeta.pitRepopulatedHook = this.pitRepopulatedHook.bind(this);
    }

    private takeFunction(stoneCount: number): number {
        return stoneCount;
    }

    private beforeTakeHook(takePit: Pit): boolean {
        console.log('Before Take Hook');
        console.log("Pit: ", takePit.whichPit());
        console.log("Stone Count: ", takePit.getStones().length);
        console.log("Lamie weled", this.gameState)



        if (this.gameState != null && this.gameState.gameStatus.turn === this.thisPlayer.id) {
            if (!this.gebeta.isAnimating && !this.gebeta.hand.moveHand) {
                this.gameState.gameStatus.move.push(takePit.whichPit())
                socketClient.emit("player:move", { ...this.gameState })
                return true;
            }

            if (this.gebeta.isDrawGo) {
                const capturePit = this.gebeta.drawGoList.find(pit => pit.whichPit() === takePit.whichPit());
                if (capturePit !== undefined) {
                    const capturedStones = capturePit.getStones().length;
                    if (this.gameState.challengee.id === this.thisPlayer.id) {
                        this.gameState.challengee.cupture += capturedStones;
                    }

                    if (this.gameState.challenger.id === this.thisPlayer.id) {
                        this.gameState.challenger.cupture += capturedStones;
                    }
                    socketClient.emit('player:captured', { ... this.gameState }, { capturedPit: capturePit.whichPit() }, (res: any) => {
                        if (res)
                            capturePit.flushStones();
                    })
                }

                return false;
            }
        }

        FaildNotify('Illegal Move', `It is not your turn!`, this.appContainer);
        return false;
    }

    private landedOnEmptyPitHook(emptyPit: Pit): void {
        console.log('Landed On Empty Pit Hook');
        // console.log("Pit: ", emptyPit.whichPit());
        // console.log("Stone Count: ", emptyPit.getStones().length);

        this.gebeta.isDrawGo = false;
        this.gebeta.drawGoList = [];

        if (this.gameState.gameStatus.turn !== this.thisPlayer.id) {
            console.log("condition one");
            this.gameState.gameStatus.turn = this.thisPlayer.id;
        } else if (this.gameState.gameStatus.turn === this.thisPlayer.id) {
            console.log("condition two");
            this.gameState.gameStatus.turn = (this.thisPlayer.id === this.gameState.challengee.id) ? this.gameState.challenger.id : this.gameState.challengee.id;
        }
    }

    private landedOnNonEmptyPitHook(nonEmptyPit: Pit): boolean {
        console.log('Landed On Non Empty Pit Hook');
        console.log("Pit: ", nonEmptyPit.whichPit());
        console.log("Stone Count: ", nonEmptyPit.getStones().length);
        return true;
    }

    private pitRepopulatedHook(repopulatedPit: Pit) {
        if (repopulatedPit.getStones().length === 4) {
            this.gebeta.isDrawGo = true;
            this.gebeta.drawGoList.push(repopulatedPit);
        }
    }
}

export default LamieWeled;