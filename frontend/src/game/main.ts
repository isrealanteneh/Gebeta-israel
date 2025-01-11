import SpinnerFullScreen from '../components/SpinnerFullScreen';
import { loadMultiple } from './asset-loader'
import { _DEBUG } from './config/debug';
import { desktopConfig } from './config/dimentions';
import Gebeta from './Gebeta';
import './style.css'

export async function initGebeta(canv: HTMLCanvasElement) {
	// const canv = document.getElementById("canv") as HTMLCanvasElement;
	canv.width = desktopConfig.boardDimention.dWidth
	canv.height = desktopConfig.boardDimention.dHeight

	const ctx = canv.getContext("2d");

	if (_DEBUG) canv.setAttribute('style', 'border: 2px solid lightgray; cursor: pointer;');

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
		gebeta.start();
		// gebeta.update(Date.now());

		requestAnimationFrame(gebeta.update.bind(gebeta))

	} catch (error) {
		console.error(error)
	}

}