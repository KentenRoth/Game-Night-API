const express = require('express');
require('./mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server up on ${port}`);
});
