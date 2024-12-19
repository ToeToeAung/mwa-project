import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { ErrorWithStatus, Token } from "../common";

export const checkToken: RequestHandler = async (req, res, next) => {
    try {
        const authentication_header = req.headers['authorization'];
        if (!authentication_header) throw new ErrorWithStatus('No Token Found', 401);

        const token = (authentication_header as string).split(" ")[1];
        if (!process.env.SECRET) throw new ErrorWithStatus('Secret not found', 401);

        const decoded = verify(token, process.env.SECRET) as Token;
        req.user = decoded;
        next();

    } catch (e) {
        next(e);
    }
};

export const checkAdm: RequestHandler = async (req, res, next) => {
    try {
        if (req.user.role === 'ShelterAdmin'){
            next();
        } else {
            throw new ErrorWithStatus('The user does not have access rights to do this action', 403);
        } 
    } catch (e) {
        next(e);
    }

}
