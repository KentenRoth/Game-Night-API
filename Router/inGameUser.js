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
	const allowedUpdates = ['name', 'property', 'money', 'netWorth'];
	const isValidUpdate = updates.every(update => {
		allowedUpdates.includes(update);
	});
	const _id = req.params.id;

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Update Failed' });
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

module.exports = router;
