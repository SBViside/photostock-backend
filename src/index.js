import Express from 'express';
import router from './routes.js';
import cookieParser from 'cookie-parser';
import { __dirname } from './modules/path.js';

const PORT = 5999;
const App = Express();

App.use(cookieParser());
App.use(Express.json());
App.use(Express.static(`${__dirname}\\public`));
App.use("/api", router);

App.listen(PORT, () => console.log(`SERVER WORKS ON PORT ${PORT}...`));

App.get('/', (req, res) => res.json("server works"));