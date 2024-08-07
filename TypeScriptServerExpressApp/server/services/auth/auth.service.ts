import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { InternalServerErrorException } from '../../shared/exceptions/http.exceptions';
const { Secrets_session } = require('../../startup/envconfig');
function signToken(obj: any) {
    return jwt.sign({ obj },
        Secrets_session, {
        expiresIn: 60 * 60 * 5
    }
    );
};
function verifyToken_old(token: string) {
    try {
        const tokenData = jwt.verify(token, Secrets_session);
        return tokenData as any;
    } catch (error: any) {
        throw new InternalServerErrorException(error);
    }
};
function verifyToken(token: string, done: Function): any {
    jwt.verify(token, Secrets_session, function (err: any, decoded: any) {
        if (err) {
            //throw new InternalServerErrorException(err);
            return done(err as any, null);
        }
        return done(err as any, decoded as any);
    });
};
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
        const token = auth.slice(7);
        // try {
        const tokenData = verifyToken(token, function (err: any, decoded: any) {
            if (decoded) {
                req.user = decoded;
                next();
            } else {
                throw new InternalServerErrorException("unauthorized : jwt malformed");
            }

        });

        // } catch (error: any) {
        //    throw new InternalServerErrorException(error);
        //}
    }
    else {
        throw new InternalServerErrorException("unauthorized");
    }
}
export { signToken, isAuthenticated, verifyToken };