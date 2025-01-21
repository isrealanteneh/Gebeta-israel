import "./css/style.global.css";
import "./css/form-pages.css";
import { selectElement } from "./utils/IncludeElements";
import { isEmail, isName, isPassword, isUsername } from "./utils/Verification";
import { httpClient } from "./utils/Network";
import SpinnerFullScreen from "./components/SpinnerFullScreen";
import { AxiosError } from "axios";
import { Response } from "./utils/ResponseModel";

try {
    const uiElements = selectElement([
        '#app',
        '#warning-txt',
        '#f-name',
        '#l-name',
        '#username',
        '#email',
        '#pass',
        '#confirm-pass',
        '#signup-btn'
    ]) as Record<string, HTMLElement>;

    const loadScreen = SpinnerFullScreen('Signing Up');
    const submitBtn = uiElements['#signup-btn'] as HTMLButtonElement;
    const fName = uiElements['#f-name'] as HTMLInputElement;
    const lName = uiElements['#l-name'] as HTMLInputElement;
    const uName = uiElements['#username'] as HTMLInputElement;
    const email = uiElements['#email'] as HTMLInputElement;
    const pass = uiElements['#pass'] as HTMLInputElement;
    const cPass = uiElements['#confirm-pass'] as HTMLInputElement;

    const resetFormState = () => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-disabled');
        loadScreen.remove();
    };

    submitBtn.addEventListener('click', async (event: Event) => {
        event.preventDefault();

        submitBtn.disabled = true;
        submitBtn.classList.add('btn-disabled');

        uiElements['#warning-txt'].textContent = '';

        fName.classList.remove('warning-input');
        lName.classList.remove('warning-input');
        uName.classList.remove('warning-input');
        email.classList.remove('warning-input');
        pass.classList.remove('warning-input');
        cPass.classList.remove('warning-input');

        if (!isName(fName.value)) {
            uiElements['#warning-txt'].textContent = 'Invalid first name.';
            fName.classList.add('warning-input');
            resetFormState();
            return;
        }

        if (!isName(lName.value)) {
            uiElements['#warning-txt'].textContent = 'Invalid last name.';
            lName.classList.add('warning-input');
            resetFormState();
            return;
        }

        if (!isUsername(uName.value)) {
            uiElements['#warning-txt'].textContent = 'Invalid username.';
            uName.classList.add('warning-input');
            resetFormState();
            return;
        }

        if (!isEmail(email.value)) {
            uiElements['#warning-txt'].textContent = 'Invalid email.';
            email.classList.add('warning-input');
            resetFormState();
            return;
        }

        if (!isPassword(pass.value)) {
            uiElements['#warning-txt'].textContent = 'Invalid password.';
            pass.classList.add('warning-input');
            resetFormState();
            return;
        }

        if (pass.value !== cPass.value) {
            uiElements['#warning-txt'].textContent = 'Confirm password doesn\'t match.';
            cPass.classList.add('warning-input');
            resetFormState();
            return;
        }

        uiElements["#app"].appendChild(loadScreen);

        try {
            const res = await httpClient.post('/signup', {
                f_name: fName.value,
                l_name: lName.value,
                username: uName.value,
                email: email.value,
                password: pass.value
            });

            const resData = res?.data as Response;
            if (resData) {
                window.location.href = "/verify/" + ((resData.result as unknown) as { user_id: string }).user_id;
            }
        } catch (err) {
            const resData = (err as AxiosError).response?.data as Response;
            if (resData) {
                uiElements['#warning-txt'].textContent = resData?.msg || "";
            }
            console.log(err);
        } finally {
            resetFormState();
        }
    });

} catch (error) {
    console.log(error);
}