import { getRandom } from "../modules/utils.js";
import connection from "./connection.js";
import userDatabase from "./userDatabase.js";

export default class imageDatabase {
    static async selectTagsBySignature(signature) {
        try {
            const response = await connection.query(`SELECT * FROM tags 
                WHERE LOWER(name) LIKE LOWER('%${signature}%') 
                    ORDER BY name LIMIT ${process.env.TAGS_LIMIT}`);
            return response.rows;
        } catch (error) {
            return false;
        }
    }

    static async selectRandom(tag_id) {
        try {
            const response = await connection.query(
                `SELECT images.id FROM images 
                ${tag_id ? ` INNER JOIN image_tags ON image_tags.image_id=image.id WHERE image_tags.tag_id=${tag_id} ` : ''} 
                ORDER BY id
            `);
            const randomId = response.rows[getRandom(0, response.rows.length - 1)].id;
            const image = await this.select(randomId);
            return image;
        } catch (error) {
            return false;
        }
    }

    static async select(imageId) {
        try {
            const imageResponse = await connection.query(
                `SELECT id, title, url_webp_preview, url_webp_full, url_full, url_medium, 
                url_small, size_full, size_medium, size_small, created_at, user_id
                    FROM images 
                    WHERE id=${imageId}`);

            const tagsResponse = await connection.query(
                `SELECT ARRAY_AGG(tags.name) as tag_names
                    FROM image_tags 
                    INNER JOIN tags 
                    ON tags.id=image_tags.tag_id 
                    WHERE image_tags.image_id=${imageId}
                    GROUP BY image_tags.image_id`);

            const userId = data.rows[0].user_id;
            const author = await userDatabase.select(userId)

            const image = imageResponse.rows[0];
            delete image.user_id;
            const tags = tagsResponse.rows[0].tag_names;

            return { data: data.rows[0], tags: tags.rows[0].tag_names, author };
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async selectUserImages(userId, page) {
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

    static async selectLikedImages(userId, page) {
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
}