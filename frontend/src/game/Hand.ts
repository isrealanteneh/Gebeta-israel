import { ImageDimention } from "./TypeDef";

class Hand {
    private ctx: CanvasRenderingContext2D | null
    private handImg: HTMLImageElement
    private dimention: ImageDimention | undefined;

    constructor(ctx: CanvasRenderingContext2D | null, handImg: HTMLImageElement) {
        this.ctx = ctx;
        this.handImg = handImg
    }

    draw(dimentions: ImageDimention) {
        this.ctx?.drawImage(
            this.handImg,
            dimentions.sX,
            dimentions.sY,
            dimentions.sWidth,
            dimentions.sHeight,
            dimentions.dX - 20,
            dimentions.dY - 20,
            dimentions.dWidth,
            dimentions.dHeight
        )

        this.dimention = { ...dimentions }
    }

    move() {
        // if (handDimention.dX <= desktopConfig.pit1Dimention[5].dX && !flopFlip) {
        // 	if (handDimention.dX >= desktopConfig.pit1Dimention[5].dX) flopFlip = false;
        // 	handDimention.dX += 8;
        // } else {
        // 	console.log(handDimention.dX, desktopConfig.pit1Dimention[0].dX)
        // 	if (handDimention.dX <= desktopConfig.pit1Dimention[0].dX) flopFlip = true;
        // 	handDimention.dX -= 8;
        // }


        // if (handDimention.dWidth <= 100 && !flipFlop) {
        // 	if (handDimention.dWidth === 100) flipFlop = true;
        // 	handDimention.dWidth += 5;
        // 	handDimention.dHeight += 5;
        // } else {
        // 	// console.log(handDimention.dWidth <= 100 && !flipFlop)

        // 	if (handDimention.dWidth === 60) flipFlop = false;
        // 	handDimention.dWidth -= 5;
        // 	handDimention.dHeight -= 5;
        // }
    }

    getDimention() {
        return this.dimention;
    }

}

interface HandEvent {
    clientX: number
    clientY: number
}

export type { HandEvent }
export { Hand }