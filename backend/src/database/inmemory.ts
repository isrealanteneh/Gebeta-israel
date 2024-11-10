import { IGame } from "../game/Game";

interface ActiveUser {
    id: string,
    isActive: boolean,
    name: string,
    username: string,
    socketId: string
}

class ActiveUserStore {
    activeUser = new Map<string, ActiveUser>();
    private static INSTANCE: ActiveUserStore | null = null;

    getAllUsers(): ActiveUser[] {
        return Array.from(this.activeUser.values());
    }

    getUser(id: string): ActiveUser | undefined {
        return this.activeUser.get(id);
    }

    addUser(id: string, user: ActiveUser) {
        this.activeUser.set(id, user);
    }

    removeUser(id: string): boolean {
        return this.activeUser.delete(id);
    }

    static getInstance() {
        if (!ActiveUserStore.INSTANCE)
            ActiveUserStore.INSTANCE = new ActiveUserStore();

        return ActiveUserStore.INSTANCE;
    }
}

class ActiveGames {
    activeGame = new Map<string, IGame>();
    private static INSTANCE: ActiveGames | null = null;

    getAllGames(): IGame[] {
        return Array.from(this.activeGame.values());
    }

    getGame(gameId: string): IGame | undefined {
        return this.activeGame.get(gameId);
    }

    addGame(gameId: string, game: IGame) {
        this.activeGame.set(gameId, game);
    }

    removeUser(gameId: string): boolean {
        return this.activeGame.delete(gameId);
    }

    static getInstance() {
        if (!ActiveGames.INSTANCE)
            ActiveGames.INSTANCE = new ActiveGames();

        return ActiveGames.INSTANCE;
    }

}

export { ActiveUserStore, ActiveGames };