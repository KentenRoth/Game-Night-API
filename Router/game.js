const express = require('express');
const router = new express.Router();
const auth = require('../Middleware/gameAuth');
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

router.post('/game/login', async (req, res) => {
	try {
		const game = await Game.findByCredentials(
			req.body.name,
			req.body.password
		);

		const authToken = await game.createAuthToken();
		res.send({ game, authToken });
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.get('/game/:id', auth, async (req, res) => {
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

router.delete('/game/:id', auth, async (req, res) => {
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
