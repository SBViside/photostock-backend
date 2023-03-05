import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import imageDatabase from '../database/imageDatabase.js';
import userDatabase from '../database/userDatabase.js';
import imageService from '../services/imageService.js';

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

    static async likedImages(req, res) {
        try {
            const accessToken = req.headers.authorization.split(' ')[1];
            const { userId } = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);


        } catch (error) {
            res.status(400).json({ message: "Get Liked Images Error" });
        }
    }

    static async uploadAvatar(req, res) {
        try {
            // VALIDATION
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.errors);
            }

            const accessToken = req.headers.authorization.split(' ')[1];
            const { userId } = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);

            const { username } = await userDatabase.select(userId);
            if (!username) throw new Error();

            const { avatar } = req.files;
            imageService.createCustomAvatar(username, avatar.data);

            res.json({ message: "Avatar was successfully updated" });
        } catch (error) {
            res.status(400).json({ message: "Upload Avatar Error" });
        }
    }
}