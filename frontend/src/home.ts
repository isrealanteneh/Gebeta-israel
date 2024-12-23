import './css/style.global.css';
import './css/home.css';
import { createApp, reactive } from './libs/petite-vue.es';
import { httpClient, socketClient } from './utils/Network';
import { isResponseModel, Response } from './utils/ResponseModel';
import { ActiveEntities, Player, Tournament } from './utils/ActiveEntities';
import { refreshAccessToken } from './utils/ReusableHttpRequests';
import { AxiosError } from 'axios';

function viewProfile(userId: string) {
    console.log(userId);
}

async function refreshAccessTokenOrReject(refreshToken: string) {
    try {
        const refreshedAccessToken = await refreshAccessToken(refreshToken);
        if (!refreshedAccessToken) {
            throw new Error('Failed to refresh access token');
        }
        sessionStorage.setItem('accessToken', refreshedAccessToken);
    } catch {
        sessionStorage.clear();
        window.location.href = "/login.html";
    }
}

async function handleUnauthorizedError(refreshToken: string) {
    try {
        await refreshAccessTokenOrReject(refreshToken);
    } catch {
        sessionStorage.clear();
        window.location.href = "/login.html";
    }
}

(async function main() {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');
    const userInfoSerialized = sessionStorage.getItem('user');

    let active = reactive({
        page: 'home',
        tournaments: [] as Tournament[],
        players: [] as Player[],

        setPage(page: string) {
            this.page = page
        },

        setTournaments(tournaments: Array<Tournament>) {
            this.tournaments = tournaments;
        },

        setPlayers(players: Array<Player>) {
            this.players = players;
        },

        addPlayer(player: Player) {
            this.players.push(player);
        },

        addTournamet(tournament: Tournament) {
            this.tournaments.push(tournament);
        },

        removePlayer(id: string) {
            this.players = this.players.filter((player: Player) => {
                return (player.id !== id)
            })
        },

        removeTournament(id: string) {
            this.tournaments = this.tournaments.filter((tournament: Player) => {
                return (tournament.id !== id)
            })
        }

    });

    if (!refreshToken) {
        sessionStorage.clear();
        window.location.href = "/login.html";
        return;
    }

    if (!accessToken) {
        await handleUnauthorizedError(refreshToken);
    }


    socketClient.on('connect', () => console.log('connected'));
    socketClient.on('user-went-offline', (playerId: string) => {
        active.removePlayer(playerId)
    });
    socketClient.on('user-went-online', (player: Player) => {
        active.addPlayer(player);
    });
    socketClient.on('disconnect', (reason, desc) => console.log("reason", reason, "desc", desc));

    socketClient.on('connect_error', async (ex) => {
        if (ex.message.includes('unauthorized')) {
            try {
                const res = await httpClient.post('/refresh-token', { refresh_token: refreshToken });
                const resData = res?.data as Response;
                if (isResponseModel(resData.result)) {
                    const newAccessToken = resData.result?.accessToken || "";
                    sessionStorage.setItem('accessToken', newAccessToken);
                    socketClient.auth = { token: newAccessToken };
                    socketClient.connect();
                }
            } catch (reason) {
                console.log(reason);
            }
        }
        console.log("EX,", ex);
    });

    let userDeserialized = reactive({
        info: {
            name: "Unknown",
            id: "no-id",
            username: "@unknown",
        },
        setInfo(
            info: {
                name: string,
                id: string,
                username: string
            }
        ) {
            this.info = info
        }
    });


    if (userInfoSerialized != null) {
        userDeserialized.setInfo(JSON.parse(userInfoSerialized));
    }


    const activeEntities = new ActiveEntities(accessToken || "");

    try {
        const activePlayers = await activeEntities.fetchActivePlayers();
        const activeTournaments = await activeEntities.fetchActiveTournaments();

        active.setPlayers(activePlayers);
        console.log(activeTournaments)
        active.setTournaments(activeTournaments);
    } catch (reason: unknown) {
        if (reason instanceof AxiosError && reason.response?.data?.result?.code === 401) {
            await handleUnauthorizedError(refreshToken);
        }
    }

    createApp({
        viewProfile,
        active,
        userDeserialized
    }).mount("#app");
})();