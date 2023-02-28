import connection from './connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { secret_access, secret_refresh, maxLengths } from '../config.js';
import { imageConfigurator } from '../modules/imageConfigurator.js';


function createTokens(data) {
    const accessToken = jwt.sign(data, secret_access, { expiresIn: '24h' });
    const refreshToken = jwt.sign(data, secret_refresh, { expiresIn: '30d' });
    return { accessToken, refreshToken };
}

export class userController {
    static async login(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                // return res.status(400).json({ message: "Username length must be between 4 and 16 characters.\nPassword length must be between 8 and 24 characters." });
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
            return res.json({ ...tokens });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Login Error" });
        }
    }

    static async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message:
                        `Username length must be between ${maxLengths.username.min} and ${maxLengths.username.max} characters.\nPassword length must be between ${maxLengths.password.min} and ${maxLengths.password.max} characters.`
                });
            }

            const { username, password } = req.body;
            const response = await connection.query(`SELECT id FROM users WHERE username='${username}'`);
            const userId = response.rows[0]?.id;

            if (userId) {
                return res.status(400).json({ message: "Account with this username already exists." });
            }

            const avatarUrl = imageConfigurator.createDefaultAvatar(username);

            // const newUser = {};


            // if (!bcrypt.compareSync(password, hashedPassword)) {
            //     return res.status(403).json({ message: "Incorrect password" });
            // }

            // const tokens = createTokens({ userId });
            return res.json({ message: 'Avatar was created!' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Registration Error" });
        }
    }
}