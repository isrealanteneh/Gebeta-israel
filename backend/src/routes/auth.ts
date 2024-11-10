import { Request, Response, Router } from "express";
import { Response as ReturnModel, Status } from "./Response";
import UserModel from "../database/models/User";
import bcrypt from 'bcryptjs';
import RevokedTokenModel from "../database/models/RevokedTokenModel";
import { isEmail, isName, isPassword, isUsername } from "../utils/Validator";
import { genVerifCode, hashPassword, signToken, verifyToken } from "../utils/security";
import { validate as uuidValidator } from 'uuid';

const authRoute = Router()

interface ILogin {
    email: string,
    password: string
}

authRoute.post('/login', async (req: Request, res: Response) => {
    const loginInfo: ILogin = req.body;

    if (!loginInfo.email || !loginInfo.password) {
        return res.status(400).json(
            new ReturnModel(
                Status.ERROR,
                `Email and password cannot be empty.`,
                400
            )
        );
    }

    try {
        const data = await UserModel.findOne({ email: loginInfo.email });

        if (!data) {
            return res.status(401).json(
                new ReturnModel(
                    Status.ERROR,
                    `Wrong email or password.`,
                    401
                )
            );
        }

        if (!data || !data.verified?.isVerified) {
            return res.status(401).json(
                new ReturnModel(
                    Status.ERROR,
                    `Your account is not verified.`,
                    401
                )
            );
        }

        const isMatch = await bcrypt.compare(loginInfo.password, data.password);

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
            id: data.user_id,
            username: data.username,
            email: data.email,
            f_name: data.f_name,
            l_name: data.l_name,
            sessionStarted: Date.now(),
            verified: (data) ? data.verified?.isVerified : false
        };

        const JWT_SECRET = process.env.JWT_SECRET || "Super secret jwt key for this project.";
        const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET || "Super secret refresh jwt key for this project.";
        const accessToken = signToken(payload, JWT_SECRET, { expiresIn: (60 * 30) }); //for 30 minutes
        const refreshToken = signToken(payload, REFRESH_JWT_SECRET, { expiresIn: (60 * 60 * 24 * 7 * 2) }); // 2 weeks of span

        res.status(200)
            .cookie("access_token", accessToken, { httpOnly: true })
            .cookie("refresh_token", refreshToken, { httpOnly: true })
            .json(
                new ReturnModel(
                    Status.SUCCESS,
                    `User logged in successfully.`,
                    200,
                    {
                        user: {
                            id: data._id,
                            username: data.username,
                            name: data.f_name + ' ' + data.l_name,
                            imgUrl: data.imgUrl || '/my-avatar.png'
                        }
                        // access_token: accessToken,
                        // refresh_token: refreshToken
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

authRoute.post('/refresh-token', async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

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
            .cookie("access_token", accessToken, { httpOnly: true })
            .json(
                new ReturnModel(
                    Status.SUCCESS,
                    `User logged in successfully.`,
                    200,
                    {
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
        const newUser = await UserModel.create({ f_name, l_name, username, email, password, verified: { code: genVerifCode(), isVerified: false } });
        const returnData = {
            user_id: newUser.user_id,
            f_name: newUser.f_name,
            l_name: newUser.l_name,
            username: newUser.username,
            email: newUser.email,
            verified: false
        }

        return res.status(201).json(new ReturnModel(Status.SUCCESS, "Your account created successfully. Please verify your account.", 201, returnData));
    } catch (err) {
        if (err?.code === 11000) {
            const property = err.keyPattern.hasOwnProperty("username") ? "Username" : "Email";
            return res.status(400).json(new ReturnModel(Status.ERROR, `${property} already in use, please try another.`, 400));
        } else {
            console.log(err);
            return res.status(500).json(new ReturnModel(Status.ERROR, "Error happened while adding a user.", 500));
        }
    }
})

authRoute.get('/verify/:id', async (req: Request, res: Response) => {
    const uuid = req.params.id;

    if (!uuidValidator(uuid)) {
        return res.status(404).render('404-page');
    }

    res.send("Okay we shall see" + uuid);
})

authRoute.post('/verify', (req: Request, res: Response) => {
    console.log(req.body)
    res.send('responded')
})

authRoute.post('/forget', (req: Request, res: Response) => {
    console.log(req.body)
    res.send('responded')
})

export default authRoute;