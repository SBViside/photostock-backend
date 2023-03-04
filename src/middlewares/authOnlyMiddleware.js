import jwt from 'jsonwebtoken';

export function authOnlyMiddleware(req, res, next) {
    try {
        const accessToken = req.headers?.authorization?.split(' ')[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Authorization Error" });
    }
}