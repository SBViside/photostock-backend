import jwt from 'jsonwebtoken';
import tokenDatabase from "../database/tokenDatabase.js";

export default class tokenService {
    static async createTokens(userId, payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME });

        if (await tokenDatabase.existsByUser(userId)) {
            await this.removeRefreshToken(userId);
        }

        await tokenDatabase.insert(userId, refreshToken);
        return { accessToken, refreshToken };
    }

    static async removeRefreshToken(userId) {
        return await tokenDatabase.delete(userId);
    }

    static async verifyRefreshToken(refreshToken) {
        try {
            const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
            if (!userId || !await tokenDatabase.existsByToken(refreshToken)) {
                return false;
            }
            return userId;
        } catch (error) {
            return false;
        }
    }
}