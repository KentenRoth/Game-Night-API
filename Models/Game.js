const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InGameUser = require('./InGameUser');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minlength: 2,
		maxlength: 15,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	tokens: [
		{
			token: {
				type: String,
				required: true
			}
		}
	]
});

GameSchema.virtual('inGameUser', {
	ref: 'InGameUser',
	localField: '_id',
	foreignField: 'owner'
});

GameSchema.pre('save', async function(next) {
	const game = this;

	if (game.isModified('password')) {
		game.password = await bcrypt.hash(game.password, 8);
	}

	next();
});

GameSchema.pre('remove', async function(next) {
	const game = this;
	await InGameUser.deleteMany({ owner: game._id });

	next();
});

GameSchema.methods.createAuthToken = async function() {
	const game = this;
	const token = jwt.sign(
		{
			_id: game._id.toString()
		},
		process.env.GAME_WEB_TOKEN
	);

	game.tokens = game.tokens.concat({ token });
	await game.save();

	return token;
};

GameSchema.statics.findByCredentials = async (name, password) => {
	const game = await Game.findOne({ name });

	if (!game) {
		throw new Error('Could not find game');
	}

	const isMatch = await bcrypt.compare(password, game.password);

	if (!isMatch) {
		throw new Error('Could not access game');
	}

	return game;
};

GameSchema.methods.toJSON = function() {
	const game = this;
	const gameObject = game.toObject();

	delete gameObject.password;
	delete gameObject.tokens;

	return gameObject;
};

module.exports = Game = mongoose.model('Game', GameSchema);
