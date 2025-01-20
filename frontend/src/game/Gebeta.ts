import { Board } from "./Board";
import { FRAME_RATE } from "./config/constants";
import { desktopConfig } from "./config/dimentions";
import EventListener from "./EventListener";
import { Hand } from "./Hand";
import Pit from "./Pit";
import { Stone } from "./Stone";
import { _DEBUG } from "./config/debug";
import { BeforeTakeHook, LandedOnEmptyPitHook, LandedOnNonEmptyPitHook, PitRepopulatedHook, TakeFunction } from "./mode/Hooks";

class Gebeta {
    canv: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    assets: HTMLImageElement[];
    pits: Pit[];
    lastTimeStamp: number = 0;
    board: Board;
    isAnimating: boolean = false;
    hand: Hand;

    /* Hooks for the different game modes */
    takeFunction: TakeFunction = (stoneCount: number) => stoneCount;
    beforeTakeHook: BeforeTakeHook = (takePit: Pit) => { takePit; return true };
    landedOnEmptyPitHook: LandedOnEmptyPitHook = (emptyPit: Pit) => emptyPit;
    landedOnNonEmptyPitHook: LandedOnNonEmptyPitHook = (nonEmptyPit: Pit) => { nonEmptyPit; return true };
    pitRepopulatedHook: PitRepopulatedHook = () => undefined
    /* ------------- */

    /* Pit control */
    isDrawGo: boolean = false
    drawGoList: Array<Pit> = []
    /* ----------- */

    handEventListener: EventListener | undefined;
    flipFlop = false;

    constructor(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D, assets: HTMLImageElement[]) {
        this.canv = canv;
        this.ctx = ctx;
        this.assets = assets;
        this.pits = [];
        this.board = new Board(this.ctx, this.assets[0]);
        this.hand = new Hand(this.ctx, this.assets[1]);
    }

    public start() {
        if (_DEBUG) console.log('start()');
        this.board.draw();
        this.initializePits();
        this.setupEventListener();
    }

    private initializePits() {
        for (let index = 0; index < 12; index++) {
            const pit = new Pit(this.ctx);
            pit.draw({ ...desktopConfig.pitsDimention[index], ...desktopConfig.pitSize });
            this.populatePit(pit, 4);
            pit.setWhich(index);
            this.pits.push(pit);
        }
    }

    private setupEventListener() {
        const eventListener = new EventListener(this.pits, this.canv, (whichPit: Pit) => {
            if (_DEBUG) console.log(`Pit number ${whichPit.whichPit()} touched`);
            try {
                if (this.beforeTakeHook(whichPit) === true) {
                    this.animateHand(whichPit);
                }
            } catch (error) {
                if (_DEBUG) console.log(error);
            }
        });

        this.canv.addEventListener('click', eventListener.eventCallback.bind(eventListener));

        this.handEventListener = new EventListener(this.pits, this.canv, (whichPit: Pit) => {
            if (whichPit == null || (whichPit.whichPit() === this.hand.sPit.whichPit() && this.hand.currentCycle === 0)) {
                this.isAnimating = false;
                this.hand.moveHand = false;
                this.hand.overPit = null as any;
                this.isDrawGo = false;
                this.drawGoList = [];
                return;
            }

            if (this.hand.overPit == null || whichPit.whichPit() !== this.hand.overPit.whichPit()) {
                this.hand.overPit = whichPit;
                let stonesInPit = this.hand.overPit.getStones().length + 1;
                this.hand.totalSteps -= 1;
                this.hand.overPit.flushStones();
                this.populatePit(this.hand.overPit, stonesInPit);
                this.pitRepopulatedHook(this.hand.overPit);
            }

            if (this.hand.totalSteps === 0) {
                const stonesInOverPit = this.hand.overPit.getStones().length;
                if (stonesInOverPit === 1) {
                    this.landedOnEmptyPitHook(this.hand.overPit);
                } else if (stonesInOverPit > 1) {
                    if (this.landedOnNonEmptyPitHook(this.hand.overPit) === true) {
                        this.animateHand(this.hand.overPit);
                    }
                }

                this.hand.moveHand = false;
                this.isAnimating = false;
                this.hand.overPit = null as any;
            }

        });
    }

    private populatePit(pit: Pit, stoneCount: number) {
        let dim = { ...desktopConfig.stoneDimention };
        if (!dim || !dim.dWidth || !dim.dHeight) {
            console.error('Invalid stone dimensions');
            return;
        }

        if (stoneCount <= 0) {
            console.error('Invalid stone count');
            return;
        }

        const pitDim = pit.getDimention();
        if (!pitDim) {
            console.error('Pit dimension is null or undefined');
            return;
        }

        if (stoneCount === 1) {
            this.populateSingleStone(pit, dim);
        } else {
            this.populateMultipleStones(pit, stoneCount, dim);
        }
    }

    private populateSingleStone(pit: Pit, dim: any) {
        let pitDim = pit.getDimention();
        if (pitDim) {
            dim.dX = pitDim.dX - (dim.dWidth / 2);
            dim.dY = pitDim.dY - (dim.dHeight / 2);
            let stone = new Stone(this.ctx, this.assets[2]);
            stone.draw(dim);
            pit.addStone(stone);
        }
    }

    private populateMultipleStones(pit: Pit, stoneCount: number, dim: any) {
        const maxDist = desktopConfig.pitSize.rad - (dim.dWidth / 2);
        let layer = 0;
        let margin = 1;

        while (stoneCount > 0) {
            layer++;
            let distance = layer * ((dim.dWidth / 2) * margin);
            if (distance > maxDist) break;

            let stonePerLayer = Math.floor(2 * Math.PI * distance / (margin * (dim.dWidth / 2)));
            let angleIncrement = (2 * Math.PI) / stonePerLayer;

            for (let i = 0; i < stonePerLayer && stoneCount > 0; i++) {
                const angle = i * angleIncrement;
                const pitDim = pit.getDimention();
                if (!pitDim) {
                    console.error('Pit dimension is null or undefined');
                    return;
                }

                const x = pitDim.dX + distance * Math.cos(angle);
                const y = pitDim.dY + distance * Math.sin(angle);

                dim.dX = x - (dim.dWidth / 2);
                dim.dY = y - (dim.dHeight / 2);

                let stone = new Stone(this.ctx, this.assets[2]);
                stone.draw(dim);
                pit.addStone(stone);
                stoneCount--;
            }

        }
    }

    public update(timeStamp: number) {
        if (_DEBUG) console.log('update()');

        const deltaTime = timeStamp - this.lastTimeStamp;
        if (deltaTime >= 1000 / FRAME_RATE) {
            this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
            this.board.draw();
            this.updatePits();
            if (this.isDrawGo) {
                this.drawGoList.forEach(pit => {
                    pit.drawGo()
                })
            }
            this.hand.update(this.handEventListener as EventListener);
            this.lastTimeStamp = timeStamp;
        }

        requestAnimationFrame(this.update.bind(this));
    }

    private updatePits() {
        this.pits.forEach(pit => {
            pit.draw(pit.getDimention());
            pit.getStones().forEach(stone => {
                stone.draw(stone.getDimention());
            });
        });
    }

    public stop() {
        if (_DEBUG) console.log('stop()');
    }

    public animateHand(sPit: Pit) {
        if (this.isAnimating) return;

        this.isAnimating = true;

        let takeAmount = this.takeFunction(sPit.getStones().length);
        if (takeAmount <= 0 || takeAmount > sPit.getStones().length) {
            this.isAnimating = false;
            if (_DEBUG) console.error(`Invalid take amount. takeAmount = ${takeAmount}`);
            throw Error('Invalid take amount. The amount of stones in a pit should be <= takeAmount.');
        }

        let stonesLeftInPit = sPit.getStones().length - takeAmount;
        let total_steps = sPit.whichPit() + takeAmount;
        let cycles = Math.floor(total_steps / this.pits.length);
        let finalPit = total_steps % this.pits.length;

        if (stonesLeftInPit === 0) {
            sPit.flushStones();
        } else {
            sPit.flushStones();
            this.populatePit(sPit, stonesLeftInPit);
        }

        this.hand.sPit = sPit;
        this.hand.dimention.dX = sPit.getDimention().dX;
        this.hand.dimention.dY = sPit.getDimention().dY;
        this.hand.dPit = this.pits[finalPit];

        this.hand.currentCycle = 0;
        this.hand.cycles = cycles;
        this.hand.totalSteps = takeAmount;
        this.hand.moveHand = true;
    }
}

export default Gebeta;