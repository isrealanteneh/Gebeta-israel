interface ImageDimention {
    sX: number,
    sY: number,
    sWidth: number,
    sHeight: number,
    dX: number,
    dY: number,
    dWidth: number,
    dHeight: number
}

interface CircleDimention {
    dX: number,
    dY: number,
    rad: number,
    startingAngle: number,
    endingAngle: number,
    cCw: boolean
}

export type { ImageDimention, CircleDimention }