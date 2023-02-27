import Express from 'express';
import router from './routes.js';

const PORT = 6000;
const App = Express();

App.use(Express.json());
App.use("/api", router);

App.get('/', (req, res) => res.json("server works"));

try {
    App.listen(PORT, () => console.log(`SERVER WORKS ON PORT ${PORT}...`));
} catch (error) {
    console.log(error);
}

