import imageDatabase from "../database/imageDatabase.js";

export default class imageController {
    static async tags(req, res) {
        try {
            const { _signature } = req.query;
            const tags = await imageDatabase.getTagsBySignature(_signature);

            if (!tags) {
                throw new Error();
            }

            res.json(tags);
        } catch (error) {
            res.status(400).json({ message: "Reqest Error" });
        }
    }

    static async userImages(req, res) {
        try {
            const { id: userId } = req.params;
            const page = req.query._page || 1;

            const userImages = await imageDatabase.getUserImages(userId, page);
            if (!userImages) {
                throw new Error();
            }

            res.json(userImages);
        } catch (error) {
            res.status(400).json({ message: "Get User Images Error" });
        }
    }
}