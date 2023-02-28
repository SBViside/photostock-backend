import Express from 'express';
import router from './routes.js';
import { __dirname } from './modules/path.js';

const PORT = 5999;
const App = Express();

App.use(Express.json());
App.use(Express.static(`${__dirname}\\public`));
App.use("/api", router);

try {
    App.listen(PORT, () => console.log(`SERVER WORKS ON PORT ${PORT}...`));
} catch (error) {
    console.log(error);
}

App.get('/', (req, res) => res.json("server works"));