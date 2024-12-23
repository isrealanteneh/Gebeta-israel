import './css/style.global.css'
import './css/form-pages.css'
import './css/login.css'
import SpinnerFullScreen from './components/SpinnerFullScreen';
import { selectElement } from './utils/IncludeElements';
import { isEmail, isPassword, isUsername } from './utils/Verification';
import { httpClient } from './utils/Network';
import { Response } from './utils/ResponseModel';
import { AxiosError } from 'axios';

try {
    const uiElements = selectElement([
        '#app',
        '#warning-txt',
        '#email-username',
        '#pass',
        '#login-btn'
    ]) as Record<string, HTMLElement>;

    const loadScreen = SpinnerFullScreen('Logging in');
    const loginBtn = uiElements['#login-btn'] as HTMLButtonElement;
    const uName = uiElements['#email-username'] as HTMLInputElement
    const pass = uiElements['#pass'] as HTMLInputElement

    loginBtn.addEventListener('click', (event: Event) => {
        event.preventDefault();

        uiElements['#warning-txt'].textContent = '';

        uName.classList.remove('warning-input');
        pass.classList.remove('warning-input');

        if ((!isUsername(uName.value) && !isEmail(uName.value))) {
            uiElements['#warning-txt'].textContent = 'Invalid username or email.';
            uName.classList.add('warning-input');
            return;
        }


        if (!isPassword(pass.value)) {
            uiElements['#warning-txt'].textContent = 'Invalid password.';
            pass.classList.add('warning-input');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.classList.add('btn-disabled');
        uiElements["#app"].appendChild(loadScreen)

        httpClient.post('/login', {
            email: uName.value,
            password: pass.value
        }).then(res => {
            loginBtn.disabled = false;
            loginBtn.classList.remove('btn-disabled');
            loadScreen.remove();

            const resData = res?.data as Response;
            if (resData) {
                console.log(resData.result?.accessToken, resData.result?.refreshToken)
                sessionStorage.setItem('user', JSON.stringify(resData.result?.user))
                sessionStorage.setItem('accessToken', resData.result?.accessToken || '')
                sessionStorage.setItem('refreshToken', resData.result?.refreshToken || '')
                window.location.href = "/home" ///" + (resData.result as { user_id: string }).user_id;
            }
        }).catch((err: AxiosError) => {
            const resData = err.response?.data as Response;
            if (resData)
                uiElements['#warning-txt'].textContent = resData?.msg || "";
            else
                uiElements["#warning-txt"].textContent = err.message;
            loginBtn.disabled = false;
            loginBtn.classList.remove('btn-disabled');
            loadScreen.remove();
            console.log(err)
        })
    })

} catch (error) {
    console.log(error)
}