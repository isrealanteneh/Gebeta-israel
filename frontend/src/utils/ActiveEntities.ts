import { AxiosError } from "axios";
import { httpClient } from "./Network";
import { Response } from "./ResponseModel";
import { GameModeType } from "../game/mode/ModeFactory";

interface Tournament {
    name: string, //"Spring Championship",
    startTime: string, //new Date().toLocaleString(),
    endTime: string,
    participantCount: number //4
};

interface Player {
    id: string, //"882cd723-a140-4268-9450-2dfdf6574984"
    isActive: boolean, //true
    name: string, //"Dawit Kebebe"
    username: string //"dawit"
};

interface Game {
    gameId: string,
    challenger: {
        id: string,
        name: string,
        username: string,
        cupture: number
    },
    challengee: {
        id: string,
        name: string,
        username: string,
        cupture: number
    },
    gameMode: GameModeType,
}

class ActiveEntities {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken
    }

    fetchActivePlayers() {
        return new Promise((resolve: (value: Array<Player>) => void, reject: (reason: AxiosError) => void) => {
            httpClient.get("/players/active", {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            }).then(res => {
                if (res.data) {
                    const responseData = res.data as Response;
                    const result = Array.isArray(responseData.result) ? responseData.result : [];
                    resolve(result as Player[]);
                } else {
                    resolve([] as Player[]);
                }
            }).catch((reason: AxiosError) => {
                reject(reason as AxiosError)
            })
        })
    }

    fetchActiveTournaments() {
        return new Promise((resolve: (value: Array<Tournament>) => void, reject: (reason: AxiosError) => void) => {
            httpClient.get("/tournaments/active", {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            })
                .then(res => {
                    if (res.data) {
                        const responseData = res.data as Response;
                        const result = Array.isArray(responseData.result) ? responseData.result : [];
                        resolve(result as Tournament[]);
                    } else {
                        resolve([] as Tournament[]);
                    }
                })
                .catch(reason => {
                    reject(reason)
                })
        })
    }

    fetchGameHistory() {
        return new Promise((resolve: (value: Array<Game>) => void, reject: (reason: AxiosError) => void) => {
            httpClient.get("/game/history", {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            }).then(res => {
                if (res.data) {
                    const responseData = res.data as Response;
                    const result = Array.isArray(responseData.result) ? responseData.result : [];
                    resolve(result as Game[]);
                } else {
                    resolve([] as Game[]);
                }
            }).catch((reason: AxiosError) => {
                reject(reason as AxiosError);
            });
        });
    }
}

export type { Player, Tournament, Game }
export { ActiveEntities }