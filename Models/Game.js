const mongoose = require('mongoose');

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

module.exports = Game = mongoose.model('Game', GameSchema);
