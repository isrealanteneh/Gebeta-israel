import '../css/style.global.css'
import './SpinnerFullScreen.css'
import './ChallengeMenu.css';
import { GameModeType } from '../game/mode/ModeFactory';


interface ChallengeMenuProps {
    title: string;
    challengee: { id: string, username: string, name: string };
    challenger: { id: string, username: string, name: string };
    onContinue: (gameMode: GameModeType) => void;
    onCancel: () => void;
}

function ChallengeMenu({ title, challengee, challenger, onContinue, onCancel }: ChallengeMenuProps) {
    const container = document.createElement('div');
    container.classList.add('challenge-menu-container');

    const header = document.createElement('h2');
    header.classList.add('title');
    header.classList.add('open-sans-500');
    header.textContent = title;

    const description = document.createElement('p');
    description.classList.add('description');
    description.classList.add('open-sans-300');
    description.innerHTML = `
        <fieldset>
            <legend>Challenger</legend>
            <div>
            <b>${challenger.name}</b> <br> @${challenger.username}
            </div>
        </fieldset>
        <fieldset>
            <legend>Challengee</legend>
            <div>
            <b>${challengee.name}</b> <br> @${challengee.username}
            </div>
        </fieldset>`;

    const dropdown = document.createElement('select');
    dropdown.classList.add('game-mode-dropdown');
    Object.values(GameModeType).forEach(mode => {
        const option = document.createElement('option');
        option.value = mode;
        option.textContent = mode;
        dropdown.appendChild(option);
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const continueButton = document.createElement('button');
    continueButton.classList.add('btn');
    continueButton.classList.add('btn-primary');
    continueButton.textContent = 'Continue';
    continueButton.addEventListener('click', () => {
        const selectedMode = dropdown.value as GameModeType;
        onContinue(selectedMode);
    });

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn');
    cancelButton.classList.add('btn-secondary');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', onCancel);

    buttonContainer.append(continueButton, cancelButton);
    container.append(header, description, dropdown, buttonContainer);

    return container;
}

export { ChallengeMenu };