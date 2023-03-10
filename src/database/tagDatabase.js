import connection from "./connection.js"

export class tagDatabase {
    static async selectByName(tagName) {
        try {
            tagName = tagName.toLowerCase();
            const response = await connection.query(
                `SELECT * FROM tags WHERE name='${tagName}'`
            );
            return response?.rows[0];
        } catch (error) {
            return false;
        }
    }

    static async insert(tagName) {
        try {
            tagName = tagName.toLowerCase();
            const response = await connection.query(
                `INSERT INTO tags (name) VALUES ('${tagName}') RETURNING id`
            );
            return response?.rows[0]?.id;
        } catch (error) {
            return false;
        }
    }

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
}