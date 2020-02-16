const express = require('express');
require('./mongoose');
const inGameUserRouter = require('./Router/inGameUser');
const game = require('./Router/game');
const user = require('./Router/user');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(inGameUserRouter);
app.use(game);
app.use(user);

app.listen(port, () => {
	console.log(`Server up on ${port}`);
});
