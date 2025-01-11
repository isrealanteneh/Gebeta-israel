import { HandEvent } from "./Hand";
import Pit from "./Pit";

class EventListener {
    private pits: Pit[];
    private canv: HTMLCanvasElement;
    private cbFunc: Function;

    constructor(pits: Pit[], canv: HTMLCanvasElement, cbFunc: Function) {
        this.pits = pits;
        this.canv = canv;
        this.cbFunc = cbFunc;
    }

    eventCallback(event: MouseEvent | HandEvent) {
        const boundRect = this.canv.getBoundingClientRect();
        let mouseX, mouseY;

        if (event instanceof MouseEvent) {
            mouseX = event.clientX - boundRect.left;
            mouseY = event.clientY - boundRect.top;
        } else {
            mouseX = event.clientX
            mouseY = event.clientY
        }

        for (let pit of this.pits) {
            const pitDim = pit.getDimention();
            if (pitDim) {
                const dX = mouseX - pitDim.dX
                const dY = mouseY - pitDim.dY
                const distance = Math.sqrt((dX * dX) + (dY * dY))

                if (distance <= pitDim.rad) {
                    this.cbFunc(pit);
                    break;
                }
            } else {
                return
            }
        }

    }
}

export default EventListener;