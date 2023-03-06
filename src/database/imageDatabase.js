import connection from "./connection.js";

export default class imageDatabase {
    static async getTagsBySignature(signature) {
        try {
            const response = await connection.query(`SELECT * FROM tags 
                WHERE LOWER(name) LIKE LOWER('%${signature}%') 
                    ORDER BY name LIMIT ${process.env.TAGS_LIMIT}`);
            return response.rows;
        } catch (error) {
            return false;
        }
    }

    static async getUserImages(userId, page) {
        try {
            const response = await connection.query(
                `SELECT images.id, images.title, images.url_webp_preview, images.url_webp_full, images.url_full, images.url_medium,
                 images.url_small, images.size_full, images.size_medium, images.size_small, images.created_at, 
                 (SELECT tags.name 
                        FROM image_tags 
                        INNER JOIN tags 
                        ON tags.id=image_tags.tag_id 
                        WHERE image_tags.image_id=images.id)
                    FROM images 
                    WHERE user_id=${userId} 
                    ORDER BY created_at DESC
                    LIMIT ${process.env.IMAGES_LIMIT} OFFSET ${page}`
            );
            return response.rows;
        } catch (error) {
            return false;
        }
    }

    static async getLikedImages(userId, page) {
        try {
            const response = await connection.query(
                `SELECT images.id, images.title, images.url_webp_preview, images.url_webp_full, images.url_full, images.url_medium,
                     images.url_small, images.size_full, images.size_medium, images.size_small, images.created_at, 
                     (SELECT tags.name 
                            FROM image_tags 
                            INNER JOIN tags 
                            ON tags.id=image_tags.tag_id 
                            WHERE image_tags.image_id=images.id)
                        FROM images 
                        INNER JOIN likes ON likes.image_id=images.id
                        WHERE likes.user_id=${userId} 
                        ORDER BY likes.created_at DESC
                        LIMIT ${process.env.IMAGES_LIMIT} OFFSET ${page}`
            );

            return response.rows;
        } catch (error) {
            return false;
        }
    }
}