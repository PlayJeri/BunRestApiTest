import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY!;


export const validateTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
    
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized', message: "Invalid or missing token" });
        }
    
        const tokenValue = token.split(' ')[1];
    
        const decodedToken = jwt.verify(tokenValue, secretKey);
    
        req.decodedToken = decodedToken;
    
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: 'Unauthorized', message: 'Token expired' });
        }
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
    }
};