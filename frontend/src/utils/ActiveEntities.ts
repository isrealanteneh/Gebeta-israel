import { AxiosError } from "axios";
import { httpClient } from "./Network";
import { Response } from "./ResponseModel";

interface Tournament {
    name: string, //"Spring Championship",
    startTime: string, //new Date().toLocaleString(),
    endTime: string,
    // (() => {
    //     let endTime = new Date()
    //     endTime.setTime(Date.now() + 8640000 * 2)
    //     return endTime.toLocaleString()
    // })(),
    participantCount: number //4
};

interface Player {
    id: string, //"882cd723-a140-4268-9450-2dfdf6574984"
    isActive: boolean, //true
    name: string, //"Dawit Kebebe"
    username: string //"dawit"
};

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
}

export type { Player, Tournament }
export { ActiveEntities }