const mongoose = require('mongoose');
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
	}
});

GameSchema.pre('save', async function(next) {
	const game = this;

	if (game.isModified('password')) {
		game.password = await bcrypt.hash(game.password, 8);
	}

	next();
});

module.exports = Game = mongoose.model('Game', GameSchema);
