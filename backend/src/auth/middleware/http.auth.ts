import { NextFunction, Request, Response } from "express";
import { Response as ReturnModel, Status } from "../../routes/Response";
import { verifyToken } from "../../utils/security";



export default function authUser(req: any, res: any, next: any) {
    try {
        const payload = verifyToken(req.headers.authorization?.split(' ')[1] || '', process.env.JWT_SECRET || 'My super secret');
        // Object.defineProperty(req, 'user' as PropertyKey, payload);
        req.user = payload;
        next()
    } catch (error) {
        res.status(401).json(
            new ReturnModel(
                Status.ERROR,
                'Unauthorized request.',
                401
            )
        )
    }
}