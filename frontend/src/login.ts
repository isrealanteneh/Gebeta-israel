import './css/style.global.css'
import './css/form-pages.css'
import './css/login.css'
import SpinnerFullScreen from './components/SpinnerFullScreen';
import { selectElement } from './utils/IncludeElements';
import { isEmail, isPassword, isUsername } from './utils/Verification';
import { httpService } from './utils/Network';
import { Response } from './utils/Response';
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

        httpService.post('/login', {
            email: uName.value,
            password: pass.value
        }).then(res => {
            loginBtn.disabled = false;
            loginBtn.classList.remove('btn-disabled');
            loadScreen.remove();

            const resData = res?.data as Response;
            if (resData) {
                window.location.href = "/home" ///" + (resData.result as { user_id: string }).user_id;
            }
        }).catch((err: AxiosError) => {
            const resData = err.response?.data as Response;
            if (resData)
                uiElements['#warning-txt'].textContent = resData?.msg || "";
            loginBtn.disabled = false;
            loginBtn.classList.remove('btn-disabled');
            loadScreen.remove();
            console.log(err)
        })
    })

} catch (error) {
    console.log(error)
}