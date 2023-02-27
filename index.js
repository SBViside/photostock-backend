import Express from 'express';

const PORT = 6000;
const App = Express();

App.use(Express.json());

try {
    App.listen(PORT, () => console.log(`SERVER WORKS ON PORT ${PORT}...`));
} catch (error) {
    console.log(error);
}