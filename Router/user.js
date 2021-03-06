const express = require('express');
const router = express.Router();
const auth = require('../Middleware/userAuth');
const User = require('../Models/User');

router.post('/user', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const authToken = await user.createAuthToken();
		res.status(201).send({ user, authToken });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/user/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);

		const authToken = await user.createAuthToken();
		res.send({ user, authToken });
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.get('/user/:id', auth, async (req, res) => {
	const _id = req.params.id;

	try {
		const user = await User.findById({ _id });
		if (!user) {
			res.status(500).send({ error: 'Could not find user' });
		}
		res.send(user);
	} catch (error) {
		res.status(500).send();
	}
});

router.patch('/user/:id', auth, async (req, res) => {
	const _id = req.params.id;
	const updates = Object.keys(req.body);
	const allowedUpdates = ['wins', 'eliminations', 'currentGames'];
	const isValidUpdate = updates.every(update =>
		allowedUpdates.includes(update)
	);

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Cannot Update' });
	}

	try {
		const user = await User.findById(_id);
		updates.forEach(update => {
			if (update === 'currentGames') {
				return user.currentGames.push(req.body[update]);
			}
			user[update] = req.body[update];
		});
		await user.save();

		if (!user) {
			res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;
