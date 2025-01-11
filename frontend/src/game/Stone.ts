import { ImageDimention } from "./TypeDef";


class Stone {

    ctx: CanvasRenderingContext2D | null
    stoneImg: HTMLImageElement
    dimention: ImageDimention = null as unknown as ImageDimention

    constructor(ctx: CanvasRenderingContext2D | null, stoneImg: HTMLImageElement) {
        this.ctx = ctx;
        this.stoneImg = stoneImg
    }

    draw(dimentions: ImageDimention) {
        this.ctx?.drawImage(
            this.stoneImg,
            dimentions.sX,
            dimentions.sY,
            dimentions.sWidth,
            dimentions.sHeight,
            dimentions.dX,
            dimentions.dY,
            dimentions.dWidth,
            dimentions.dHeight
        )

        this.dimention = { ...dimentions }
    }

    getDimention(): ImageDimention {
        return this.dimention
    }

}

export { Stone }