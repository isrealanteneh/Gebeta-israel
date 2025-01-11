import { desktopConfig } from "./config/dimentions";
import { ImageDimention } from "./TypeDef";


class Board {
    ctx: CanvasRenderingContext2D | null
    boardImg: HTMLImageElement
    dim: ImageDimention

    constructor(ctx: CanvasRenderingContext2D | null, boardImg: HTMLImageElement, dim?: ImageDimention) {
        this.ctx = ctx;
        this.boardImg = boardImg
        this.dim = dim || desktopConfig.boardDimention
    }

    draw() {
        this.ctx?.drawImage(
            this.boardImg,
            this.dim.sX,
            this.dim.sY,
            this.dim.sWidth,
            this.dim.sHeight,
            this.dim.dX,
            this.dim.dY,
            this.dim.dWidth,
            this.dim.dHeight
        )
    }

}

export { Board }