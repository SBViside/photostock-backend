import jwt from 'jsonwebtoken';
import tokenDatabase from "../database/tokenDatabase.js";

export default class tokenService {
    static async createTokens(userId, payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME });
        await tokenDatabase.insert(userId, refreshToken);

        return { accessToken, refreshToken };
    }

    static async removeRefreshToken(userId) {
        return await tokenDatabase.delete(userId);
    }
}