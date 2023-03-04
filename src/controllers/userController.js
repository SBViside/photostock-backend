import jwt from 'jsonwebtoken';
import userDatabase from '../database/userDatabase.js';

export default class userController {
    static async getInfo(req, res) {
        try {
            const accessToken = req.headers.authorization.split(' ')[1];
            const { userId } = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);

            const user = await userDatabase.select(userId);
            if (!user) throw new Error();

            res.json(user);
        } catch (error) {
            res.status(400).json({ message: "Get User Data Error" });
        }
    }
}