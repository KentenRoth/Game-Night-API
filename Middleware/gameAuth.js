const jwt = require('jsonwebtoken');
const Game = require('../Models/Game');

const gameAuth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.GAME_WEB_TOKEN);
		const game = await Game.findOne({
			_id: decoded._id,
			'tokens.token': token
		});

		if (!game) {
			throw new Error();
		}

		req.token = token;
		req.game = game;
		next();
	} catch (error) {
		res.status(401).send({ error: 'No Authentication' });
	}
};

module.exports = gameAuth;
