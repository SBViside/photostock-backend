import jwt from 'jsonwebtoken';
import tokenDatabase from "../database/tokenDatabase.js";

export default class tokenService {
    static async createTokens(userId, payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME });

        await tokenDatabase.deleteByUser(userId);
        await tokenDatabase.insert(userId, refreshToken);
        return { accessToken, refreshToken };
    }

    static async verifyRefreshToken(refreshToken) {
        try {
            const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
            const exists = await tokenDatabase.existsByToken(refreshToken);

            if (!exists || !userId) {
                throw new Error();
            }

            return userId;
        } catch (error) {
            await tokenDatabase.deleteByToken(refreshToken);
            return false;
        }
    }

    static async logout(refreshToken) {
        try {
            await tokenDatabase.deleteByToken(refreshToken);

        } catch (error) {
            return false;
        }
    }
}