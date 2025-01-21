import '../css/style.global.css';
import './SpinnerFullScreen.css';
import './ViewProfile.css';

interface ViewProfileProps {
    user: { id: string, username: string, name: string };
    onLogout: () => void;
    onCancel: () => void;
}

function ViewProfile({ user, onLogout, onCancel }: ViewProfileProps) {
    const container = document.createElement('div');
    container.classList.add('view-profile-container');

    const header = document.createElement('h2');
    header.classList.add('title');
    header.classList.add('open-sans-500');
    header.textContent = 'Profile';

    const description = document.createElement('p');
    description.classList.add('description');
    description.classList.add('open-sans-300');
    description.innerHTML = `
        <fieldset>
            <legend>User Information</legend>
            <div>
                <b>Name:</b> ${user.name} <br>
                <b>Username:</b> @${user.username}
            </div>
        </fieldset>`;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const logoutButton = document.createElement('button');
    logoutButton.classList.add('btn');
    logoutButton.classList.add('btn-secondary');
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', onLogout);

    const editButton = document.createElement('button');
    editButton.classList.add('btn');
    editButton.classList.add('btn-primary');
    editButton.textContent = 'Cancel';
    editButton.addEventListener('click', onCancel);

    buttonContainer.append(logoutButton, editButton);
    container.append(header, description, buttonContainer);

    return container;
}

export { ViewProfile };