const jwt = require('jsonwebtoken');
const InGameUser = require('../Models/InGameUser');

const inGameUserAuth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.GAME_USER_WEB_TOKEN);
		const inGameUser = await InGameUser.findOne({
			_id: decoded._id,
			'tokens.token': token
		});

		if (!inGameUser) {
			throw new Error();
		}

		req.token = token;
		req.inGameUser = inGameUser;
		next();
	} catch (error) {
		res.status(401).send({ error: 'No Authentication' });
	}
};

module.exports = inGameUserAuth;
