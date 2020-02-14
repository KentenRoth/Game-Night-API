const express = require('express');
const router = new express.Router();
const InGameUser = require('../Models/InGameUser');

router.post('/inGameUser', async (req, res) => {
	const userCreated = new InGameUser(req.body);

	try {
		await userCreated.save();
		res.send(userCreated);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/inGameUser', async (req, res) => {
	try {
		const inGameUser = await InGameUser.find({});
		res.send(inGameUser);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
