const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const InGameUserSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 2,
		maxlength: 15
	},
	property: {
		type: [],
		propertyName: {
			type: String,
			required: true
		},
		propertyBuildings: {
			type: Number,
			required: true
		},
		ownsAllProperty: {
			type: Boolean,
			default: false
		}
	},
	money: {
		type: Number,
		required: true
	},
	netWorth: {
		type: Number,
		required: true
	},
	pin: {
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

InGameUserSchema.pre('save', async function(next) {
	const inGameUser = this;
	if (inGameUser.isModified('pin')) {
		inGameUser.pin = await bcrypt.hash(inGameUser.pin, 8);
	}
	next();
});

InGameUserSchema.methods.createAuthToken = async function() {
	const inGameUser = this;
	const token = jwt.sign(
		{
			_id: inGameUser._id.toString()
		},
		process.env.GAME_USER_WEB_TOKEN
	);

	inGameUser.tokens = inGameUser.tokens.concat({ token });
	await inGameUser.save();

	return token;
};

module.exports = InGameUser = mongoose.model('InGameUser', InGameUserSchema);
