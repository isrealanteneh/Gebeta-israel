import "./css/style.global.css";
import "./css/form-pages.css";
import { selectElement } from "./utils/IncludeElements";
import { isPassword } from "./utils/Verification";
import { httpClient } from "./utils/Network";
import SpinnerFullScreen from "./components/SpinnerFullScreen";
import { AxiosError } from "axios";
import { Response } from "./utils/ResponseModel";

try {
    const uiElements = selectElement([
        '#app',
        '#warning-txt',
        '#new-pass',
        '#confirm-new-pass',
        '#reset-btn'
    ]) as Record<string, HTMLElement>;

    const loadScreen = SpinnerFullScreen('Resetting Password');
    const submitBtn = uiElements['#reset-btn'] as HTMLButtonElement;
    const newPass = uiElements['#new-pass'] as HTMLInputElement;
    const confirmNewPass = uiElements['#confirm-new-pass'] as HTMLInputElement;

    submitBtn.addEventListener('click', (event: Event) => {
        event.preventDefault();

        submitBtn.disabled = true;
        submitBtn.classList.add('btn-disabled');

        uiElements['#warning-txt'].textContent = '';

        newPass.classList.remove('warning-input');
        confirmNewPass.classList.remove('warning-input');

        if (!isPassword(newPass.value)) {
            uiElements['#warning-txt'].textContent = 'Invalid password.';
            newPass.classList.add('warning-input');
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-disabled');
            return;
        }

        if (newPass.value !== confirmNewPass.value) {
            uiElements['#warning-txt'].textContent = 'Confirm password doesn\'t match.';
            confirmNewPass.classList.add('warning-input');
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-disabled');
            return;
        }

        uiElements["#app"].appendChild(loadScreen);

        const token = window.location.pathname.split('/').pop();

        httpClient.post(`/reset/${token}`, {
            password: newPass.value
        }).then(res => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-disabled');
            loadScreen.remove();

            const resData = res?.data as Response;
            if (resData) {
                uiElements['#warning-txt'].textContent = 'Password has been reset. You can now log in.';
                setTimeout(() => {
                    window.location.href = "/login.html";
                }, 2000);
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