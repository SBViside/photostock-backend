import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import imageDatabase from "../database/imageDatabase.js";
import { likeDatabase } from '../database/likeDatabase.js';
import userDatabase from "../database/userDatabase.js";
import imageService from '../services/imageService.js';
import { tagDatabase } from '../database/tagDatabase.js';

export default class imageController {
    static async postImage(req, res) {
        try {
            // VALIDATION
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.errors);
            }

            const accessToken = req.headers?.authorization?.split(' ')[1];

            const { userId } = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
            const { title, tags } = req.body;
            const { image } = req.files;

            const { pathes, webpPathes } = await imageService.handleNewImage(image);
            const newImage = await imageDatabase.insert({ userId, title, tags, pathes, webpPathes });

            if (!newImage) throw new Error();
            res.json(newImage);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Upload Image Error" });
        }
    }

    static async tags(req, res) {
        try {
            const { _signature } = req.query;
            const tags = await tagDatabase.selectTagsBySignature(_signature);

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

            const userImages = await imageDatabase.selectUserImages(userId, page);
            if (!userImages) throw new Error();

            res.json(userImages);
        } catch (error) {
            res.status(400).json({ message: "Get User Images Error" });
        }
    }
}