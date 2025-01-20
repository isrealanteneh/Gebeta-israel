import "./css/style.global.css";
import "./css/form-pages.css";
import { selectElement } from "./utils/IncludeElements";
import { isEmail } from "./utils/Verification";
import { httpClient } from "./utils/Network";
import SpinnerFullScreen from "./components/SpinnerFullScreen";
import { AxiosError } from "axios";
import { Response } from "./utils/ResponseModel";

try {
    const uiElements = selectElement([
        '#app',
        '#warning-txt',
        '#email',
        '#forget-btn'
    ]) as Record<string, HTMLElement>;

    const loadScreen = SpinnerFullScreen('Sending Reset Link');
    const submitBtn = uiElements['#forget-btn'] as HTMLButtonElement;
    const email = uiElements['#email'] as HTMLInputElement;

    submitBtn.addEventListener('click', (event: Event) => {
        event.preventDefault();

        submitBtn.disabled = true;
        submitBtn.classList.add('btn-disabled');

        uiElements['#warning-txt'].textContent = '';

        email.classList.remove('warning-input');

        if (!isEmail(email.value)) {
            uiElements['#warning-txt'].textContent = 'Invalid email.';
            email.classList.add('warning-input');
            return;
        }

        uiElements["#app"].appendChild(loadScreen);

        httpClient.post('/forget', {
            email: email.value
        }).then(res => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-disabled');
            loadScreen.remove();

            const resData = res?.data as Response;
            if (resData) {
                uiElements['#warning-txt'].textContent = 'Password reset email sent. Please check your inbox.';
            }
        }).catch((err: AxiosError) => {
            const resData = err.response?.data as Response;
            if (resData)
                uiElements['#warning-txt'].textContent = resData?.msg || "";
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-disabled');
            loadScreen.remove();
            console.log(err);
        });
    });

} catch (error) {
    console.log(error);
}