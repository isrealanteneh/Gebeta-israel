import { _DEBUG } from "./config/debug";
import { Stone } from "./Stone";
import { CircleDimention } from "./TypeDef";

class Pit {
    private ctx: CanvasRenderingContext2D
    private dimention: CircleDimention = null as unknown as CircleDimention;
    private num: number = 0;
    private stones: Array<Stone>

    constructor(ctx: CanvasRenderingContext2D, stones?: Stone[]) {
        this.ctx = ctx;
        this.stones = stones || [] as Stone[]
    }

    draw(dimentions: CircleDimention) {
        this.ctx.beginPath();
        if (this.ctx !== null) this.ctx.strokeStyle = 'transparent';
        if (_DEBUG && this.ctx !== null) this.ctx.strokeStyle = 'red'
        this.ctx.arc(dimentions.dX, dimentions.dY, dimentions.rad, dimentions.startingAngle, dimentions.endingAngle, dimentions.cCw);
        this.ctx.stroke()
        // this.ctx?.closePath();
        this.dimention = { ...dimentions };
    }

    getDimention(): CircleDimention {
        return this.dimention;
    }

    setWhich(num: number) {
        this.num = num;
    }

    whichPit() {
        return this.num;
    }

    setStones(stones: Array<Stone>) {
        this.stones = stones;
    }

    addStone(stone: Stone) {
        this.stones.push(stone)
    }

    getStones() { return this.stones; }

    flushStones() { this.stones.length = 0 }
}

export default Pit;