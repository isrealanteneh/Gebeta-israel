import "./css/style.global.css";
import "./css/form-pages.css";
import "./css/verify.css";
import { selectElement } from "./utils/IncludeElements";
import { validateVCode } from "./utils/Verification";

try {
    const uiElements = selectElement(['#warning-txt', '#v-code-in', '#verify-btn', '#resend-btn']) as Record<string, HTMLElement>;

    let countDown = 90;

    const resendBtn = uiElements['#resend-btn'] as HTMLButtonElement;
    const verifyBtn = uiElements['#verify-btn'] as HTMLButtonElement;
    const verificationNumIn = uiElements['#v-code-in'] as HTMLInputElement;
    const warningTxt = uiElements['#warning-txt'] as HTMLParagraphElement;

    const intervalId = setInterval(() => {
        resendBtn.textContent = `Resend in ${(--countDown)}s`;
        if (countDown === 0) {
            resendBtn.textContent = "Resend";
            resendBtn.classList.remove('btn-disabled');
            resendBtn.classList.add('btn-resend');
            resendBtn.removeAttribute("disabled");
            clearInterval(intervalId);
        }
    }, 1000);

    verifyBtn.addEventListener('click', () => {
        verificationNumIn.classList.remove('warning-input');
        warningTxt.textContent = '';

        if (!validateVCode(verificationNumIn.value)) {
            warningTxt.textContent = "Invalid varification code.";
            verificationNumIn.classList.add('warning-input');
            return;
        }

        console.log(window.location.pathname)
        // const res = axios.post(`verify/${id}`, {
        //     code
        // })
    })


} catch (error) {

}