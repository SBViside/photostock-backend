import imageDatabase from "../database/imageDatabase.js";
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

    static async setLike(req, res) {
        try {
            const accessToken = req.headers.authorization.split(' ')[1];
            const { userId } = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
            const { id: imageId } = req.params;

            const liked = await imageDatabase.insertLike(userId, imageId);
            if (!liked) throw new Error();

            res.json({ message: "Successfully Liked" });
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
            const { _tag_id } = req.query;

            const imageInfo = await imageDatabase.selectRandom(_tag_id);
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