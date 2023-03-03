import { validationResult } from 'express-validator';
import imageService from '../services/imageService.js';
import tokenService from '../services/tokenService.js';
import userDatabase from '../database/userDatabase.js';

export class authController {
    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Check your data." });
            }

            const { username, password } = req.body;
            const userId = await userDatabase.getId(username);

            if (!userId) {
                return res.status(403).json({ message: "Incorrect username" });
            }
            if (!await userDatabase.comparePasswords(username, password)) {
                return res.status(403).json({ message: "Incorrect password" });
            }

            const { accessToken, refreshToken } = await tokenService.createTokens(userId, { userId });
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({ accessToken });
        } catch (error) {
            return res.status(400).json({ message: "Authorization Error" });
        }
    }

    static async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Check your data'
                });
            }

            const { username, password } = req.body;

            if (await userDatabase.exists(username)) {
                return res.status(400).json({ message: "Account with this username already exists." });
            }
            const avatarUrl = imageService.createDefaultAvatar(username);
            const userId = await userDatabase.insert({ username, avatarUrl, password });

            const { accessToken, refreshToken } = await tokenService.createTokens(userId, { userId });
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({ accessToken });
        } catch (error) {
            return res.status(400).json({ message: "Registration Error" });
        }
    }

    static async refresh(req, res) {
        try {
            const userRefreshToken = req.cookies?.refreshToken;
            if (!userRefreshToken) {
                return res.status(401).json({ message: "Authorization Error" });
            }

            const userId = await tokenService.verifyRefreshToken(userRefreshToken);
            if (!userId) {
                return res.status(401).json({ message: "Refresh Token Is Invalid" });
            }

            const { accessToken, refreshToken } = await tokenService.createTokens(userId, { userId });
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json({ accessToken });
        } catch (error) {
            return res.status(400).json({ message: "Token Refresh Error" });
        }
    }

    static async logout(req, res) {
        try {

        } catch (error) {
            return res.status(400).json({ message: "Logout Error" });
        }
    }
}