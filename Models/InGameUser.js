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
		maxlength: 20
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
		default: 1500
	},
	netWorth: {
		type: Number,
		default: 1500
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
	],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Game'
	}
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

InGameUserSchema.statics.findByCredentials = async (name, pin) => {
	const inGameUser = await InGameUser.findOne({ name });

	if (!inGameUser) {
		throw new Error('Could not find user');
	}

	const isMatch = await bcrypt.compare(pin, inGameUser.pin);

	if (!isMatch) {
		throw new Error('Could not access player');
	}
	return inGameUser;
};

InGameUserSchema.methods.toJSON = function() {
	const inGameUser = this;
	const inGameUserObject = inGameUser.toObject();

	delete inGameUserObject.pin;

	return inGameUserObject;
};

module.exports = InGameUser = mongoose.model('InGameUser', InGameUserSchema);
