import connection from "./connection.js"

export class likeDatabase {
    static async insertLike(userId, imageId) {
        try {
            const response = await connection.query(
                `INSERT INTO likes (user_id, image_id) VALUES (${userId}, ${imageId})`
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    static async deleteLike(userId, imageId) {
        try {
            const response = await connection.query(
                `DELETE FROM likes WHERE user_id=${userId} AND image_id=${imageId}`
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    static async isLiked(userId, imageId) {
        try {
            const response = await connection.query(
                `SELECT id FROM likes WHERE user_id=${userId} AND image_id=${imageId}`
            );
            if (!response.rows[0]?.id) throw new Error();
            return true;
        } catch (error) {
            return false;
        }
    }
}