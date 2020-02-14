const express = require('express');
require('./mongoose');
const inGameUserRouter = require('./Router/inGameUser');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(inGameUserRouter);

app.listen(port, () => {
	console.log(`Server up on ${port}`);
});
