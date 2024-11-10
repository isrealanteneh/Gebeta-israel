interface IPlayer {
    id: string;
}

class Player implements IPlayer {
    id: string;
    order: number = 0;


    constructor(id: string) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string) {
        this.id = id;
    }

    setOrder(order: number) {
        this.order = order
    }

    getOrder() {
        return this.order;
    }
}

export type { IPlayer }
export { Player }