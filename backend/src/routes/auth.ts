import { Request, Response, Router } from "express";
import { Response as ReturnModel, Status } from "./Response";
import UserModel from "../database/models/User";
import bcrypt from 'bcryptjs';
import RevokedTokenModel from "../database/models/RevokedTokenModel";
import { isEmail, isName, isPassword, isUsername } from "../utils/Validator";
import { genVerifCode, hashPassword, signToken, verifyToken } from "../utils/Security";
import { validate as uuidValidator } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import Emailer from "../utils/Emailer";
import { promisify } from "util";
import crypto from 'crypto';

const authRoute = Router()

interface ILogin {
    email: string,
    password: string
}

authRoute.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(
            new ReturnModel(
                Status.ERROR,
                `Email and/or password cannot be empty.`,
                400
            )
        );
    }

    try {
        // let userData: {
        //     user_id?: string;
        //     createdAt?: NativeDate;
        //     f_name?: string;
        //     l_name?: string;
        //     username?: string;
        //     email?: string;
        //     password?: string;
        //     imgUrl?: string;
        //     verified?: {
        //         isVerified?: boolean;
        //         code?: string;
        //     }
        // };

        let userData;

        if (isEmail(email)) {
            userData = await UserModel.findOne({ email });
        } else if (isUsername(email)) {
            userData = await UserModel.findOne({ username: email });
        } else {
            return res.status(401).json(
                new ReturnModel(
                    Status.ERROR,
                    `Wrong email or password.`,
                    401
                )
            );
        }

        if (!userData || !userData.verified?.isVerified) {
            return res.status(401).json(
                new ReturnModel(
                    Status.ERROR,
                    `Your account is not verified.`,
                    401
                )
            );
        }

        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
            return res.status(401).json(
                new ReturnModel(
                    Status.ERROR,
                    `Wrong email or password.`,
                    401
                )
            );
        }

        const payload = {
            id: userData?.user_id,
            username: userData?.username,
            email: userData?.email,
            f_name: userData?.f_name,
            l_name: userData?.l_name,
            sessionStarted: Date.now(),
            verified: (userData) ? userData?.verified.isVerified : false
        };

        const JWT_SECRET = process.env.JWT_SECRET || "Super secret jwt key for this project.";
        const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET || "Super secret refresh jwt key for this project.";
        const accessToken = signToken(payload, JWT_SECRET, { expiresIn: (60 * 30) }); //for 30 minutes
        const refreshToken = signToken(payload, REFRESH_JWT_SECRET, { expiresIn: (60 * 60 * 24 * 7 * 2) }); // 2 weeks of span

        res.status(200)
            // .cookie("access_token", accessToken, { expires: new Date(Date.now() + 900000), secure: false, sameSite: 'lax', httpOnly: false })
            // .cookie("refresh_token", refreshToken, { expires: new Date(Date.now() + 900000), secure: false, sameSite: 'lax', httpOnly: false })
            .json(
                new ReturnModel(
                    Status.SUCCESS,
                    `User logged in successfully.`,
                    200,
                    {
                        user: {
                            id: userData?.user_id,
                            username: userData?.username,
                            name: userData?.f_name + ' ' + userData?.l_name,
                            imgUrl: userData?.imgUrl
                        },
                        accessToken,
                        refreshToken
                    }
                )
            );
    } catch (err) {
        res.status(500).json(
            new ReturnModel(
                Status.ERROR,
                `Could not generate a token.`,
                500
            )
        );

        console.log(err);
    }
})

authRoute.get('/login', (req, res) => {
    res.render('login');
})

authRoute.post('/refresh-token', async (req: Request, res: Response) => {
    const { refresh_token } = req.body;
    console.log(refresh_token)
    const JWT_SECRET = process.env.JWT_SECRET || "Super secret jwt key for this project.";
    const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET || "Super secret refresh jwt key for this project.";

    try {
        const decodedData = verifyToken(refresh_token, REFRESH_JWT_SECRET) as {
            id: string,
            username: string,
            email: string,
            f_name: string,
            l_name: string,
            sessionStarted: number,
            verified: boolean,
            exp: number,
            iat: number
        };;

        if (!decodedData) {
            return res.status(401).json(
                new ReturnModel(
                    Status.ERROR,
                    `Invalid refresh token.`,
                    401
                )
            );
        }

        const inRevokedList = await RevokedTokenModel.findOne({ token: refresh_token });
        if (inRevokedList && ((inRevokedList.revokedAt + (1000 * 60 * 60 * 24 * 7 * 2)) - Date.now() <= 0)) {
            return res.status(401).json(
                new ReturnModel(
                    Status.ERROR,
                    `Expired or revoked refresh token.`,
                    401
                )
            );
        }
        const { iat, exp, ...returnDecodedData } = decodedData;

        console.log(returnDecodedData);
        const accessToken = signToken(returnDecodedData, JWT_SECRET, { expiresIn: (60 * 30) }); //for 30 minutes

        return res.status(200)
            // .cookie("access_token", accessToken, { httpOnly: true })
            .json(
                new ReturnModel(
                    Status.SUCCESS,
                    `User logged in successfully.`,
                    200,
                    {
                        user: {},
                        accessToken,
                        refreshToken: ''
                        // access_token: accessToken
                    }
                )
            );
    } catch (err) {
        console.log(err)
        return res.status(400).json(
            new ReturnModel(
                Status.ERROR,
                `Invalid refresh token.`,
                400
            )
        );
    }
})

authRoute.post('/logout', (req: Request, res: Response) => {
    console.log(req.body)
    res.send('responded')
})

authRoute.post('/signup', async (req: Request, res: Response) => {
    const { f_name, l_name, username, email, imgUrl } = req.body;
    let { password } = req.body;

    if (!isName(f_name)) {
        return res.status(400).json(new ReturnModel(Status.ERROR, "Invalid first name, please enter a valid name.", 400));
    }

    if (!isName(l_name)) {
        return res.status(400).json(new ReturnModel(Status.ERROR, "Invalid last name, please enter a valid name.", 400));
    }

    if (!isUsername(username)) {
        return res.status(400).json(new ReturnModel(Status.ERROR, "Invalid username, please enter a valid username.", 400));
    }

    if (!isEmail(email)) {
        return res.status(400).json(new ReturnModel(Status.ERROR, "Invalid email address, please enter a valid email address.", 403));
    }

    if (!isPassword(password)) {
        return res.status(400).json(new ReturnModel(Status.ERROR, "Invalid password, please enter a password with at least 8 characters long, with at least 1 special character and at least 1 digit.", 400));
    }


    try {
        password = await hashPassword(password);
        const newUser = await UserModel.create({ user_id: uuidv4(), f_name, l_name, username, email, password, verified: { code: genVerifCode(), isVerified: false } });
        const returnData = {
            user_id: newUser.user_id,
            f_name: newUser.f_name,
            l_name: newUser.l_name,
            username: newUser.username,
            email: newUser.email,
            verified: false
        }

        return res.status(201).cookie('user_id', returnData.user_id, { httpOnly: true }).json(new ReturnModel(Status.SUCCESS, "Your account created successfully. Please verify your account.", 201, returnData));
    } catch (err) {
        if (err?.code === 11000) {
            const property = Object.keys(err?.keyPattern).join(',') //.hasOwnProperty("username") ? "Username" : "Email";
            return res.status(400).json(new ReturnModel(Status.ERROR, `${property} already in use, please try another.`, 400));
        } else {
            console.log(err);
            return res.status(500).json(new ReturnModel(Status.ERROR, "Error happened while adding a user.", 500));
        }
    }
})

authRoute.get('/verify/:id', async (req: Request, res: Response) => {
    const uuid = req.params.id;
    const { user_id: cookieUUID } = req.cookies;

    if (uuid !== cookieUUID) {
        return res.status(403).render('403-forbidden');
    }

    if (!uuidValidator(uuid)) {
        return res.status(404).render('404-page');
    }

    const userData = await UserModel.findOne(
        {
            user_id: uuid,
            "verified.isVerified": false
        }
    );

    if (userData && userData.email) {
        new Emailer(
            userData.email,
            `Gebeta verification code`,
            `${userData?.verified?.code}`
        ).sendEmail().then(result => console.log(result)).catch(err => console.log(err));
        res.status(200).render('verify');
    } else {
        res.status(403).render('403-forbidden');
    }
})

authRoute.post('/verify', async (req: Request, res: Response) => {
    const { user_id, code } = req.body;
    // const { user_id: cookieUUID } = req.cookies;

    // if (user_id !== cookieUUID) {
    //     return res.status(400).json(
    //         new ReturnModel(Status.ERROR, "Invalid user_id.", 400, {
    //             user_id,
    //             code
    //         })
    //     );
    // }

    const userData = await UserModel.findOneAndUpdate(
        {
            user_id: user_id,
            "verified.code": code,
            "verified.isVerified": false
        },
        {
            $set: {
                verified: {
                    code: code,
                    isVerified: true
                }
            }
        },
        { new: true }
    );

    if (userData.verified.isVerified) {
        return res.status(204).json(
            new ReturnModel(
                Status.SUCCESS,
                "Your account successfully verified.",
                204
            )
        )
    } else {
        return res.status(400).json(
            new ReturnModel(
                Status.ERROR,
                "Your account verification was unsuccessful.",
                400
            )
        )
    }
})

authRoute.post('/forget', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = (await promisify(crypto.randomBytes)(20)).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        new Emailer(
            user.email,
            `Gebeta Password Reset`,
            `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   http://${req.headers.host}/reset/${resetToken}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        ).sendEmail().then(result => console.log(result)).catch(err => console.log(err));

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

authRoute.post('/reset/:token', async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default authRoute;