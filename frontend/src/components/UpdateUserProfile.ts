import '../css/style.global.css';
import './SpinnerFullScreen.css';
import './UpdateUserProfile.css';

interface UpdateUserProfileProps {
    user: { id: string, firstName: string, lastName: string, username: string, email: string };
    onUpdate: (updatedUser: { firstName: string, lastName: string, username: string, email: string }) => void;
    onCancel: () => void;
}

function UpdateUserProfile({ user, onUpdate, onCancel }: UpdateUserProfileProps) {
    const container = document.createElement('div');
    container.classList.add('update-user-profile-container');

    const header = document.createElement('h2');
    header.classList.add('title');
    header.classList.add('open-sans-500');
    header.textContent = 'Update Profile';

    const warningText = document.createElement('p');
    warningText.id = 'warning-txt';
    warningText.classList.add('warning-txt');
    warningText.classList.add('open-sans-400');

    const firstNameInput = document.createElement('input');
    firstNameInput.type = 'text';
    firstNameInput.name = 'f_name';
    firstNameInput.placeholder = 'First Name';
    firstNameInput.id = 'f-name';
    firstNameInput.classList.add('input-1');
    firstNameInput.classList.add('open-sans-400');
    firstNameInput.value = user.firstName;

    const lastNameInput = document.createElement('input');
    lastNameInput.type = 'text';
    lastNameInput.name = 'l_name';
    lastNameInput.placeholder = 'Last Name';
    lastNameInput.id = 'l-name';
    lastNameInput.classList.add('input-1');
    lastNameInput.classList.add('open-sans-400');
    lastNameInput.value = user.lastName;

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.name = 'username';
    usernameInput.placeholder = 'Username';
    usernameInput.id = 'username';
    usernameInput.classList.add('input-1');
    usernameInput.classList.add('open-sans-400');
    usernameInput.value = user.username;

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'Email';
    emailInput.id = 'email';
    emailInput.classList.add('input-1');
    emailInput.classList.add('open-sans-400');
    emailInput.value = user.email;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const updateButton = document.createElement('button');
    updateButton.classList.add('btn');
    updateButton.classList.add('btn-primary');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
        const updatedUser = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            username: usernameInput.value,
            email: emailInput.value
        };
        onUpdate(updatedUser);
    });

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn');
    cancelButton.classList.add('btn-secondary');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', onCancel);

    buttonContainer.append(updateButton, cancelButton);
    container.append(header, warningText, firstNameInput, lastNameInput, usernameInput, emailInput, buttonContainer);

    return container;
}

export { UpdateUserProfile };