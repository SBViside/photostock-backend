import { getRandom } from "../modules/utils.js";
import connection from "./connection.js";
import { tagDatabase } from "./tagDatabase.js";
import userDatabase from "./userDatabase.js";

export default class imageDatabase {
    static async insert(imageData) {
        try {
            const title = imageData.title?.trim() || 'No title';

            const response = await connection.query(`INSERT INTO images 
                (user_id, title, url_webp_preview, url_webp_full, url_full, url_medium, url_small)
                VALUES (${imageData.userId}, '${title}', '${imageData.webpPathes.preview}', '${imageData.webpPathes.full}',
                '${imageData.pathes.full}', '${imageData.pathes.middle}', '${imageData.pathes.small}') RETURNING id`);

            const imageId = response?.rows[0]?.id;
            const arrayOfTags = imageData.tags.split(',');

            for (let i = 0; i < arrayOfTags.length; i++) {
                const tag = arrayOfTags[i].trim();
                await this.insertImageTag(imageId, tag);
            }

            return await this.select(imageId);
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async insertImageTag(imageId, tag) {
        try {
            let { id: tagId } = await tagDatabase.selectByName(tag);
            if (!tagId) {
                tagId = await tagDatabase.insert(tag)
            }
            response = await connection.query(
                `INSERT INTO image_tags (image_id, tag_id) VALUES (${imageId}, ${tagId})`
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    static async selectRandom(tag_id) {
        try {
            const response = await connection.query(
                `SELECT images.id FROM images 
                ${tag_id ? ` INNER JOIN image_tags ON image_tags.image_id=images.id WHERE image_tags.tag_id=${tag_id} ` : ''} 
                ORDER BY id
            `);
            const randomId = response.rows[getRandom(0, response.rows.length - 1)].id;
            const image = await this.select(randomId);
            return image;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async select(imageId) {
        try {
            const imageResponse = await connection.query(
                `SELECT id, title, url_webp_preview, url_webp_full, 
                url_full, url_medium, url_small, created_at, user_id, 
                (SELECT COUNT(likes.image_id) FROM likes WHERE image_id=${imageId}) as likes
                    FROM images 
                    WHERE images.id=${imageId}`);

            const tagsResponse = await connection.query(
                `SELECT ARRAY_AGG(tags.name) as tags
                    FROM image_tags 
                    INNER JOIN tags 
                    ON tags.id=image_tags.tag_id 
                    WHERE image_tags.image_id=${imageId}
                    GROUP BY image_tags.image_id`);

            const userId = imageResponse.rows[0].user_id;

            const image = imageResponse.rows[0];
            const tags = tagsResponse.rows[0].tags || [];
            const author = await userDatabase.select(userId)

            return { image, tags, author };
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async selectUserImages(userId, page) {
        try {
            const limit = process.env.IMAGES_LIMIT;

            const response = await connection.query(
                `SELECT images.id, images.title, images.url_webp_preview, images.url_webp_full, images.url_full, images.url_medium, images.url_small, images.created_at, users.username AS author, users.avatar_url AS author_url, 
                (SELECT COUNT(likes.image_id) FROM likes WHERE image_id=images.id) AS likes,
                (SELECT ARRAY_AGG(tags.name) 
                        FROM image_tags 
                        INNER JOIN tags 
                        ON tags.id=image_tags.tag_id 
                        WHERE image_tags.image_id=images.id) AS tags
                    FROM images 
                    INNER JOIN users ON users.id=images.user_id
                    WHERE images.user_id=${userId} 
                    ORDER BY images.created_at DESC
                    LIMIT ${limit} OFFSET ${(limit * page) - limit}`
            );
            return response.rows;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async selectLikedImages(userId, page) {
        try {
            const limit = process.env.IMAGES_LIMIT;

            const response = await connection.query(
                `SELECT images.id, images.title, images.url_webp_preview, images.url_webp_full, images.url_full, images.url_medium, images.url_small, images.created_at, users.username AS author, users.avatar_url AS author_url, 
                    (SELECT COUNT(likes.image_id) FROM likes WHERE image_id=images.id) AS likes,
                    (SELECT ARRAY_AGG(tags.name) 
                            FROM image_tags 
                            INNER JOIN tags 
                            ON tags.id=image_tags.tag_id 
                            WHERE image_tags.image_id=images.id) AS tags
                        FROM images 
                        INNER JOIN likes ON likes.image_id=images.id
                        INNER JOIN users ON users.id=images.user_id
                        WHERE likes.user_id=${userId} 
                        ORDER BY likes.created_at DESC
                        LIMIT ${limit} OFFSET ${(limit * page) - limit}`
            );

            return response.rows;
        } catch (error) {
            return false;
        }
    }
}