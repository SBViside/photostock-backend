import connection from "./connection.js";

export default class tokenDatabase {
    static async insert(userId, refreshToken) {
        try {
            await connection.query(`INSERT INTO tokens (token, user_id) VALUES ('${refreshToken}', ${userId})`);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async delete(userId) {
        try {
            const exists = await this.existsByUser(userId);
            if (!exists) throw new Error();
            await connection.query(`DELETE FROM tokens WHERE user_id=${userId}`);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async existsByUser(userId) {
        try {
            const response = await connection.query(`SELECT * FROM tokens WHERE user_id=${userId}`);
            const exists = response.rows[0]?.token;
            return !!exists;
        } catch (error) {
            return false;
        }
    }

    static async existsByToken(refreshToken) {
        try {
            const response = await connection.query(`SELECT * FROM tokens WHERE token='${refreshToken}'`);
            const exists = response.rows[0]?.user_id;
            return !!exists;
        } catch (error) {
            return false;
        }
    }
}