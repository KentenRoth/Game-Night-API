const express = require('express');
const router = new express.Router();
const Game = require('../Models/Game');

router.post('/game', async (req, res) => {
	const game = new Game(req.body);

	try {
		await game.save();
		const authToken = await game.createAuthToken();
		res.status(201).send({ game, authToken });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/game/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const game = await Game.findById({ _id });
		if (!game) {
			res.status(500).send();
		}
		res.send(game);
	} catch (error) {
		res.status(500).send();
	}
});

router.delete('/game/:id', async (req, res) => {
	const _id = req.params.id;
	try {
		const game = await Game.findByIdAndDelete(_id);

		if (!game) {
			return res.status(400).send();
		}
		res.send(game);
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;
