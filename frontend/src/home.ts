import './css/style.global.css';
import './css/home.css';
import { createApp } from './libs/petite-vue.es';
import { socketClient } from './utils/Network';
import { ActiveEntities } from './utils/ActiveEntities';
import { AxiosError } from 'axios';
import { initGebeta } from './game/main';
import state from './utils/StateManagement';
import { getUserInfo } from './utils/user';
import { setupSocketHandlers } from './utils/HandleSocket';
import { handleUnauthorizedError } from './utils/HandleUnauthorizedError';
import { Player } from './utils/ActiveEntities';
import { ChallengeMenu } from './components/ChallengeMenu';
import { Notification } from './components/NotifyFaildProcess';
import { Notification as SuccessNotification } from './components/NotifySuccessProcess';
import { ViewProfile } from './components/ViewProfile';

let App: any = null;
const appContainer = document.querySelector('#app') as HTMLDivElement;

function viewProfile(userId: string) {
    const viewProfileMenu = ViewProfile({
        user: {
            id: state.user.id,
            username: state.user.username,
            name: state.user.name,
        },
        onLogout: () => {
            localStorage.clear();
            socketClient.disconnect();
            viewProfileMenu.remove();
            window.location.href = "/login.html";
        },
        onCancel: () => {
            viewProfileMenu.remove();
        }

    })

    appContainer.appendChild(viewProfileMenu);

}

async function populateActiveEntities(accessToken: string) {
    const activeEntities = new ActiveEntities(accessToken || "");

    try {
        const activePlayers = await activeEntities.fetchActivePlayers();
        const activeTournaments = await activeEntities.fetchActiveTournaments();
        const gameHistory = await activeEntities.fetchGameHistory();

        state.setGameHistory(gameHistory);
        state.setPlayers(activePlayers.filter(((player: Player) => player.id !== state.user.id)))
        state.setTournaments(activeTournaments);
    } catch (reason: unknown) {
        if (reason instanceof AxiosError && reason.response?.data?.result?.code === 401) {
            const newAccessToken = await handleUnauthorizedError('Expired access token');
            if (newAccessToken) {
                populateActiveEntities(newAccessToken);
            } else {
                window.location.href = 'login.html';
            }
        }
    }
}

function challengePlayer(playerId: string, event: any) {
    const challengee = state.players.find((player: Player) => player.id === playerId);
    event.target?.setAttribute('disabled', 'true');
    event.target?.classList.add('btn-disabled');

    if (challengee) {
        const challengeMenu = ChallengeMenu({
            title: 'Challenge Menu',
            challengee: {
                id: challengee.id,
                username: challengee.username,
                name: challengee.name
            },
            challenger: {
                id: state.user.id,
                username: state.user.username,
                name: state.user.name
            },
            onContinue: (gameMode) => {
                console.log(gameMode);

                socketClient.emit('challenge', {
                    challenger: state.user,
                    challengee: {
                        id: playerId
                    },
                    gameMode
                });

                challengeMenu.remove();
                event.target?.removeAttribute('disabled');
                event.target?.classList.remove('btn-disabled');
                SuccessNotification('Request Successfully sent!', `Your request to ${challengee.name} was sent successfully!`, appContainer);
            },
            onCancel: () => {
                challengeMenu.remove();
                event.target?.removeAttribute('disabled');
                event.target?.classList.remove('btn-disabled');
                console.log('Cancel');
            }
        });

        appContainer.appendChild(challengeMenu);
    } else {
        Notification('Error', 'Player not found in active player list.', appContainer);
    }
}

function searchActivePlayer() {
    const searchInput = document.querySelector('#search-player') as HTMLInputElement;
    const searchValue = searchInput.value;

    if (searchValue === '') {
        state.setSearchedPlayers([]);
    } else {
        const searchedPlayers = state.players.filter((player: Player) => (player.name.toLowerCase().includes(searchValue.toLowerCase())));
        state.setSearchedPlayers(searchedPlayers);
    }
}

(async function main() {
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
        const newAccessToken = await handleUnauthorizedError('No access token found.');
        if (newAccessToken === null || newAccessToken === undefined) {
            window.location.href = 'login.html';
        }
    }

    setupSocketHandlers(socketClient, appContainer);

    socketClient.on('connect', () => console.log('connected'));

    const userInfo = getUserInfo()
    if (userInfo) {
        state.setUser(userInfo);
        populateActiveEntities(accessToken || '');
    } else {
        Notification("User Info Error", "Error while loading user info. Deserialized user info not found.", appContainer);
    }

    App = createApp({
        challengePlayer,
        viewProfile,
        searchActivePlayer,
        state,
        showGameView() {
            if (this.state.page === 'game') {
                console.log("Game view is already active");
                this.$nextTick(() => {
                    console.log(document.querySelector('#canv'))
                    initGebeta(document.querySelector('#canv') as HTMLCanvasElement, this.state.game.gameMode);
                });
            }
        },
    });

    App.mount("#app");
})();
