import jwt from 'jsonwebtoken';
import imageDatabase from "../database/imageDatabase.js";
import { likeDatabase } from '../database/likeDatabase.js';
import userDatabase from "../database/userDatabase.js";

export default class imageController {
    static async tags(req, res) {
        try {
            const { _signature } = req.query;
            const tags = await imageDatabase.selectTagsBySignature(_signature);

            if (!tags) throw new Error();
            res.json(tags);
        } catch (error) {
            res.status(400).json({ message: "Reqest Error" });
        }
    }

    static async toggleLike(req, res) {
        try {
            const accessToken = req.headers.authorization.split(' ')[1];
            const { userId } = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
            const { id: imageId } = req.params;

            const isLiked = await likeDatabase.isLiked(userId, imageId);

            const changed = isLiked ? await likeDatabase.deleteLike(userId, imageId) : await likeDatabase.insertLike(userId, imageId);
            if (!changed) throw new Error();

            res.json({ message: "Successfully Changed" });
        } catch (error) {

            res.status(400).json({ message: "Set Like Error" });
        }
    }

    static async singleImage(req, res) {
        try {
            const { id: imageId } = req.params;

            const imageInfo = await imageDatabase.select(imageId);
            if (!imageInfo) throw new Error();

            res.json(imageInfo);
        } catch (error) {
            res.status(400).json({ message: "Get Image Data Error" });
        }
    }

    static async randomImage(req, res) {
        try {
            const { tag_id } = req.query;

            const imageInfo = await imageDatabase.selectRandom(tag_id);
            if (!imageInfo) throw new Error();

            res.json(imageInfo);
        } catch (error) {

            res.status(400).json({ message: "Get Random Image Error" });
        }
    }

    static async userImages(req, res) {
        try {
            const { id: userId } = req.params;
            const page = req.query._page || 1;

            const { username } = await userDatabase.select(userId);
            const userImages = await imageDatabase.selectUserImages(userId, page);
            if (!userImages || !username) throw new Error();

            res.json({ user: username, userImages });
        } catch (error) {
            res.status(400).json({ message: "Get User Images Error" });
        }
    }
}