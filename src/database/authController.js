import connection from './connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { secret_access, secret_refresh, maxLengths, access_token_lifetime, refresh_token_lifetime } from '../config.js';
import { imageController } from '../modules/imageController.js';


function createTokens(data) {
    const accessToken = jwt.sign(data, secret_access, { expiresIn: access_token_lifetime });
    const refreshToken = jwt.sign(data, secret_refresh, { expiresIn: refresh_token_lifetime });
    return { accessToken, refreshToken };
}

export class authController {
    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Check your data." });
            }

            const { username, password } = req.body;

            const response = await connection.query(
                `SELECT id, password FROM users WHERE username='${username}'`
            );

            const userId = response.rows[0]?.id;
            const hashedPassword = response.rows[0]?.password;

            if (!userId) {
                return res.status(403).json({ message: "Incorrect username" });
            }
            if (!bcrypt.compareSync(password, hashedPassword)) {
                return res.status(403).json({ message: "Incorrect password" });
            }

            const tokens = createTokens({ userId });
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Login Error" });
        }
    }

    static async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message:
                        `Username length must be between ${maxLengths.username.min} and ${maxLengths.username.max} characters.\nPassword length must be between ${maxLengths.password.min} and ${maxLengths.password.max} characters.`
                });
            }

            const { username, password } = req.body;

            let response = await connection.query(
                `SELECT id FROM users WHERE username='${username}'`
            );

            let userId = response.rows[0]?.id;

            if (userId) {
                return res.status(400).json({ message: "Account with this username already exists." });
            }

            const avatarUrl = imageController.createDefaultAvatar(username);
            const hashedPassword = bcrypt.hashSync(password, 8);

            response = await connection.query(
                `INSERT INTO 
                    users (username, password, avatar_url) 
                        VALUES ('${username}', '${hashedPassword}', '${avatarUrl}') RETURNING id`
            );

            userId = response.rows[0].id;

            const tokens = createTokens({ userId });
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Registration Error" });
        }
    }

    static async refresh(req, res) {
        try {
            // const refreshToken = req.cookie.refreshToken;

            // if (!refreshToken) {
            //     return res.status(401).json({ message: 'Authorization Error' })
            // }



        } catch (error) {

        }
    }

    static async logout(req, res) {
        try {

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Logout Error" });
        }
    }
}