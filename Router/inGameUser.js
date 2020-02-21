const express = require('express');
const router = new express.Router();
const InGameUser = require('../Models/InGameUser');

router.post('/inGameUser', async (req, res) => {
	const userCreated = new InGameUser(req.body);

	try {
		await userCreated.save();
		const authToken = await userCreated.createAuthToken();
		res.send({ userCreated, authToken });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/inGameUser/login', async (req, res) => {
	try {
		const inGameUser = await inGameUser.findByCredentials(
			req.body.name,
			req.body.pin
		);
		const authToken = await Gamepad.createAuthToken();
		res.send({ game, authToken });
	} catch (error) {
		res.status(400).send(error.message);
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

router.get('/inGameUser/:id', async (req, res) => {
	const _id = req.params.id;
	try {
		const inGameUser = await InGameUser.findById({ _id });
		if (!inGameUser) {
			return res.status(400).send();
		}
		res.send(inGameUser);
	} catch (error) {
		res.status(500).send();
	}
});

router.patch('/inGameUser/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		'name',
		'property',
		'propertyName',
		'propertyBuildings',
		'ownsAllProperty',
		'money',
		'netWorth'
	];
	const isValidUpdate = updates.every(update =>
		allowedUpdates.includes(update)
	);

	const _id = req.params.id;

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid Update' });
	}

	try {
		const inGameUser = await InGameUser.findByIdAndUpdate(_id, req.body, {
			new: true,
			runValidators: true
		});
		if (!inGameUser) {
			res.status(404).send();
		}
		res.send(inGameUser);
	} catch (error) {
		res.status(500).send();
	}
});

router.delete('/inGameUser/:id', async (res, req) => {
	const _id = req.params.id;

	try {
		const inGameUser = await InGameUser.findByIdAndDelete({ _id });

		if (!inGameUser) {
			res.status(404).send();
		}

		res.status(200).send(inGameUser);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
