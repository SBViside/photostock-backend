import connection from "./connection.js";
import bcrypt from 'bcrypt';

export default class userDatabase {
    static async insert({ username, password, avatarUrl }) {
        try {
            const hashedPassword = bcrypt.hashSync(password, 8);
            const response = await connection.query(
                `INSERT INTO users (username, password, avatar_url) 
                    VALUES ('${username}', '${hashedPassword}', '${avatarUrl}') RETURNING id`
            );
            return response.rows[0]?.id;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async exists(username) {
        try {
            const response = await connection.query(
                `SELECT id FROM users WHERE username='${username}'`
            );
            return !!response.rows.length;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async comparePasswords(username, password) {
        try {
            const response = await connection.query(
                `SELECT password FROM users WHERE username='${username}'`
            );

            const hashedPassword = response.rows[0]?.password;
            if (!bcrypt.compareSync(password, hashedPassword)) {
                throw new Error();
            }

            return true;
        } catch (error) {
            return false;
        }
    }
}