const express = require('express');
const router = express.Router();
const User = require('../Models/User');

router.post('/user', async (req, res) => {
	try {
		await user.save();
		res.status(201).send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/user/:id', async (req, res) => {
	const _id = req.params._id;

	try {
		const user = await User.findById({ _id });
		if (!user) {
			res.status(500).send();
		}
		res.send(user);
	} catch (error) {
		res.status(500).send();
	}
});

router.patch('/user/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		'wins',
		'eliminations',
		'currentGames',
		'gameName',
		'gameToken'
	];
	const isValidUpdate = updates.every(update =>
		allowedUpdates.includes(update)
	);

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Update failed' });
	}

	try {
		const user = await User.findByIdAndUpdate(_id, req.body, {
			new: true,
			runValidators: true
		});
		if (!user) {
			res.status(404).send();
		}
		res.send(user);
	} catch (error) {}
});
