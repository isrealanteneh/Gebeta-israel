import { GameModeType } from "../game/mode/ModeFactory";
import { reactive } from "../libs/petite-vue.es";
import { Player, Tournament } from "./ActiveEntities";

let state = reactive({
    page: 'home',
    tournaments: [] as Tournament[],
    players: [] as Player[],
    user: {
        name: "Unknown",
        id: "no-id",
        username: "@unknown"
    },

    game: {
        gameId: "",
        challenger: {
            id: "",
            name: "",
            username: ""
        },
        challengee: {
            id: "",
            name: "",
            username: ""
        },
        gameMode: GameModeType.LM,
        gameStatus: {
            turn: "",
            move: Array<number>(),
        }
    },

    setGame(game: {
        gameId: string,
        challenger: {
            id: string,
            name: string,
            username: string
        },
        challengee: {
            id: string,
            name: string,
            username: string
        },
        gameStatus: {
            turn: string,
            move: number[]
        }
    }) {
        this.game = game;
    },

    setUser(
        user: {
            name: string,
            id: string,
            username: string
        }
    ) {
        this.user = user
    },

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

export default state;