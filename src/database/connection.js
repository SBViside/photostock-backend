import pg from "pg";

export default new pg.Pool({
    host: 'localhost',
    user: 'postgres',
    password: '587649',
    database: 'photostock',
    port: '5432'
});