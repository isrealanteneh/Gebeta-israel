import { Board } from "./Board";
import { _DEBUG } from "./config/debug";
import { desktopConfig } from "./config/dimentions";
import EventListener from "./EventListener";
import { Hand, HandEvent } from "./Hand";
import Pit from "./Pit";
import { Stone } from "./Stone";
import { TakeFunction } from "./TypeDef";

class Gebeta {
    canv: HTMLCanvasElement
    ctx: CanvasRenderingContext2D;
    assets: HTMLImageElement[] | []
    pits: Array<Pit>
    lastTimeStamp: number = 0
    board: Board
    hand: {
        hand: Hand,
        moveHand: boolean,
        sPit: Pit,
        dPit: Pit,
        handDim: {
            sX: number;
            sY: number;
            sWidth: number;
            sHeight: number;
            dX: number;
            dY: number;
            dWidth: number;
            dHeight: number;
        },

        cycles: number,
        currentCycle: number,
        overPit: Pit,
        totalSteps: number,

    }
    takeFunction: TakeFunction = (stoneCount: number) => stoneCount
    handEventListener: EventListener | undefined

    flipFlop = false

    constructor(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D, assets: HTMLImageElement[] | []) {
        this.canv = canv
        this.ctx = ctx
        this.assets = assets
        this.pits = []
        this.board = new Board(this.ctx, this.assets[0]);
        this.hand = {
            hand: new Hand(this.ctx, this.assets[1]),
            moveHand: false,
            sPit: null as unknown as Pit,
            dPit: null as unknown as Pit,
            handDim: { ...desktopConfig.handDimention },

            overPit: null as unknown as Pit,
            cycles: 0,
            currentCycle: 0,
            totalSteps: 0,
        }
    }

    /**
     * start
     */
    public start() {
        if (_DEBUG) console.log('start()')

        this.board.draw()

        for (let index = 0; index < 12; index++) {
            const pit = new Pit(this.ctx);
            pit.draw({ ...desktopConfig.pit1Dimention[index], ...desktopConfig.pitSize })

            this.populatePit(pit, 4); //Num of stones should be provided by the engine user algorithm

            pit.setWhich(index);
            this.pits.push(pit);
        }

        const eventListener = new EventListener(this.pits, this.canv, (whichPit: Pit) => {
            if (_DEBUG) console.log(`Pit number ${whichPit.whichPit()} touched`)

            // this.hand.sPit = whichPit
            // let takeAmount = this.takeFunction((whichPit.getStones().length))
            // this.hand.dPit = this.pits[takeAmount % 11]
            // this.hand.moveHand = true
            this.animateHand(whichPit)
        })

        this.canv.addEventListener('click', eventListener.eventCallback.bind(eventListener));

    }


    private populatePit(pit: Pit, stoneCount: number) {
        let dim = { ...desktopConfig.stoneDimention }

        if (stoneCount === 1) {
            let pitDim = pit.getDimention()
            if (pitDim != undefined) {
                dim.dX = pitDim.dX - (dim.dWidth / 2)
                dim.dY = pitDim.dY - (dim.dHeight / 2)

                let stone = new Stone(this.ctx, this.assets[2])
                stone.draw(dim);
                pit.addStone(stone);
            }
        } else {
            const maxDist = desktopConfig.pitSize.rad - (dim.dWidth / 2)
            let stonePerLayer = 0
            let angleIncrement = 0
            let distance = 0
            let layer = 0

            let margin = 1

            while (stoneCount > 0) {
                layer++
                distance = layer * ((dim.dWidth / 2) * margin)

                if (distance > maxDist) break

                stonePerLayer = Math.floor(2 * Math.PI * distance / (margin * (dim.dWidth / 2)))
                angleIncrement = (2 * Math.PI) / stonePerLayer

                for (let i = 0; i < stonePerLayer && stoneCount > 0; i++) {
                    const angle = i * angleIncrement;
                    const x = (pit.getDimention()?.dX || 0) + distance * Math.cos(angle)
                    const y = (pit.getDimention()?.dY || 0) + distance * Math.sin(angle)

                    dim.dX = x - (dim.dWidth / 2)
                    dim.dY = y - (dim.dHeight / 2)

                    let stone = new Stone(this.ctx, this.assets[2])
                    stone.draw(dim);
                    pit.addStone(stone);

                    stoneCount--;
                }
            }
        }
    }

    /**
     * update
    */
    public update(timeStamp: number) {
        if (_DEBUG) console.log('update()');

        const deltaTime = timeStamp - this.lastTimeStamp

        if (deltaTime >= 1000 / 30) {
            //Moves and updates happen here, the rest is history

            this.ctx.clearRect(0, 0, this.canv.width, this.canv.height)
            this.board.draw()
            this.pits.forEach(pit => {
                pit.draw(pit.getDimention())
                let stones = pit.getStones()
                stones.forEach(stone => {
                    stone.draw(stone.getDimention())
                })
            })


            if (this.hand.moveHand) {
                if (!this.hand.dPit) return;

                let moveByPxl = {
                    x: 15,
                    y: 0,
                    height: 0,
                    width: 0
                }

                if (
                    this.hand.handDim.dX <= this.pits[11].getDimention().dX &&
                    this.hand.handDim.dY == this.pits[11].getDimention().dY
                ) {
                    moveByPxl.x = 0
                    moveByPxl.y = (250.5 - 104.5)
                    this.hand.currentCycle += 1

                    console.log('The start of row one');
                } else if (
                    this.hand.handDim.dX >= this.pits[5].getDimention().dX &&
                    this.hand.handDim.dY == this.pits[5].getDimention().dY
                ) {
                    moveByPxl.x = 0
                    moveByPxl.y = (104.5 - 250.5)

                    console.log('The end of row one');
                } else if (
                    this.hand.handDim.dY <= this.pits[6].getDimention().dY
                ) {
                    moveByPxl.x = -15
                    moveByPxl.y = 0

                    console.log('The start of row two');
                }

                // if (this.hand.handDim.dWidth <= 100 && !this.flipFlop) {
                //     if (this.hand.handDim.dWidth === 100) this.flipFlop = true;
                //     moveByPxl.width = 10;
                //     moveByPxl.height = 10;
                // } else {
                //     if (this.hand.handDim.dWidth === 60) this.flipFlop = false;
                //     moveByPxl.width = -10;
                //     moveByPxl.height = -10;
                // }

                this.hand.handDim.dX += moveByPxl.x
                this.hand.handDim.dY += moveByPxl.y
                this.hand.handDim.dWidth += moveByPxl.width
                this.hand.handDim.dHeight += moveByPxl.height

                if (_DEBUG) console.log(this.hand.handDim)

                this.handEventListener?.eventCallback({
                    clientX: this.hand.handDim.dX,
                    clientY: this.hand.handDim.dY
                } as HandEvent)

                this.hand.hand.draw(this.hand.handDim)
            }
            this.hand.moveHand = !(this.hand.totalSteps === 0)
            this.lastTimeStamp = timeStamp
        }

        requestAnimationFrame(this.update.bind(this))
    }

    /**
     * stop
     */
    public stop() {
        if (_DEBUG) console.log('stop()')
    }


    // Take function is a function by which the engine determines how many stones to pick from the hole

    registerTakeFunction(takeFunction: TakeFunction) {
        this.takeFunction = takeFunction;
    }

    private animateHand(sPit: Pit) {
        let takeAmount = this.takeFunction(sPit.getStones().length)
        if (takeAmount <= 0 || takeAmount > sPit.getStones().length) {
            if (_DEBUG) console.error(`Invalid take amount. takeAmount = ${takeAmount}`)
            throw Error('Invalid take amount. The amount of stones in a pit should be <= takeAmount.')
        }

        let stonesLeftInPit = sPit.getStones().length - takeAmount
        let total_steps = sPit.whichPit() + takeAmount
        let cycles = Math.floor(total_steps / this.pits.length)
        let finalPit = total_steps % this.pits.length

        if (_DEBUG) console.log(`
            Stones to take: ${takeAmount} \n 
            Stones in pit: ${sPit.getStones().length} \n
            Total Steps: ${total_steps} \n
            Cycles: ${cycles} \n
            Destination Pit: ${finalPit}`);

        if (stonesLeftInPit === 0) {
            sPit.flushStones()
        } else {
            sPit.flushStones()
            this.populatePit(sPit, stonesLeftInPit);
        }

        this.hand.sPit = sPit
        this.hand.handDim.dX = sPit.getDimention().dX
        this.hand.handDim.dY = sPit.getDimention().dY
        this.hand.dPit = this.pits[finalPit]

        this.hand.currentCycle = 0
        this.hand.cycles = cycles
        this.hand.totalSteps = takeAmount
        this.hand.moveHand = true

        this.handEventListener = new EventListener(this.pits, this.canv, (whichPit: Pit) => {
            if (whichPit == null || (whichPit.whichPit() === this.hand.sPit.whichPit() && this.hand.currentCycle === 0)) return;
            // if (_DEBUG) console.log(whichPit.whichPit())
            if (this.hand.overPit == null || whichPit.whichPit() !== this.hand.overPit.whichPit()) {
                this.hand.overPit = whichPit;
                let stonesInPit = this.hand.overPit.getStones().length + 1;
                this.hand.totalSteps -= 1;
                this.hand.overPit.flushStones();
                this.populatePit(this.hand.overPit, stonesInPit);
            }
        })
    }

}

export default Gebeta;