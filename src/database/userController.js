import connection from './connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secret } from '../config.js';


function createToken(data) {
    return jwt.sign(data, secret, { expiresIn: '24h' });
}

export class userController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            const response = await connection.query(
                `SELECT id, password FROM users WHERE username='${username}'`
            );

            const userId = response.rows[0]?.id;
            const hashedPassword = response.rows[0]?.password;

            if (!hashedPassword) {
                return res.status(403).json({ message: "Incorrect username" });
            }
            if (!bcrypt.compareSync(password, hashedPassword)) {
                return res.status(403).json({ message: "Incorrect password" });
            }

            const token = createToken({ userId });
            return res.json({ token });
        } catch (error) {
            console.log(error);
            return res.json({ message: "Login Error" });
        }
    }
}