import { createTransport, Transporter } from "nodemailer"
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";


class Emailer {
    transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
    mailOptions: any;

    constructor(toEmail: string, subject: string, message: string) {
        this.transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.BROADCASTER_EMAIL || 'endeshawtadese496@gmail.com',
                pass: process.env.BROADCASTER_PASS || 'crjpidclpmiberci'
            }
        });

        this.mailOptions = {
            from: process.env.BROADCASTER_EMAIL || 'Ge',
            to: toEmail,
            subject: subject, //|| 'NODEMAILER TEST!',
            html: VerificationScafold(message)
            //text: message //|| 'If you have received this email, that means our node configuration for nodemailer is successful and now we can send verification code successfully. I am happy that it worked for me after so many tries and I want to share that with you !'
        };
    }

    sendEmail() {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(this.mailOptions)
                .then(result => resolve(result))
                .catch(err => reject(err))
        });
    }
}

function VerificationScafold(msg: string) {
    return `
        <!doctype html>
        <html lang="en">

        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Gebeta - Verification Code</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

                :root {
                    --whiteColor: #ffffff;
                    --accentColor: #633403;
                }

                .app {
                    padding: 1rem 2rem;
                }

                .header {
                    padding: 1rem;
                    font-size: 2em;
                    background-color: var(--accentColor);
                    color: var(--whiteColor);
                }

                p {
                    padding: 1rem;
                    font-size: 1.5em;
                }

                .open-sans-300 {
                    font-family: "Open Sans", serif;
                    font-optical-sizing: auto;
                    font-weight: 300;
                    font-style: normal;
                    font-variation-settings:
                        "wdth" 100;
                }
            </style>
        </head>

        <body>
            <div id="app" class="app">
                <div class="header open-sans-300">Verify your account</div>
                <p class="email-content open-sans-300">
                    Your verification code is: <code>${msg}</code>
                </p>
            </div>
        </body>

        </html>
    `
}

export default Emailer;
export { VerificationScafold }
