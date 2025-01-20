import SpinnerFullScreen from '../components/SpinnerFullScreen';
import state from '../utils/StateManagement';
import { loadMultiple } from './asset-loader'
import { _DEBUG } from './config/debug';
import { desktopConfig } from './config/dimentions';
import Gebeta from './Gebeta';
import { GameState } from './mode/Mode';
import ModeFactory, { GameModeType } from './mode/ModeFactory';
import GebetaGame from './store/gebetaObjStore';

import './style.css'

export async function initGebeta(canv: HTMLCanvasElement, gameModeType: GameModeType) {
	console.log(gameModeType);
	canv.width = desktopConfig.boardDimention.dWidth
	canv.height = desktopConfig.boardDimention.dHeight

	const ctx = canv.getContext("2d");

	if (_DEBUG) canv.setAttribute('style', 'border: 2px solid red; cursor: pointer;');

	try {
		if (ctx === null) {
			alert("Your browser does not support HTML 5 canvas. Please upgrade your browser and try again.");
			throw new Error("Your browser does not support HTML 5 canvas. Please upgrade your browser and try again.");
		}

		const spinner = SpinnerFullScreen("Loading Game Assets");
		document.querySelector("#app")?.appendChild(spinner);
		const assets = await loadMultiple(["Light_Wooden_Board.jpg", "hand.png", "stone.png"])
		spinner.remove();

		const gebeta = new Gebeta(canv, ctx, assets);
		const gameMode = ModeFactory.create(gameModeType, gebeta);

		const gameState = { ...state.game } as GameState;
		gameState.challengee.cupture = 0;
		gameState.challenger.cupture = 0;
		gameState.gameStatus.move = [];

		gameMode.setGameState(gameState);
		gameMode.setPlayer({ ...state.user });
		gameMode.start();
		gameMode.update();

		const gameStore = GebetaGame.getInstance()
		gameStore.setGebeta(gebeta);
		gameStore.setGameMode(gameMode);

	} catch (error) {
		console.error(error)
	}

}