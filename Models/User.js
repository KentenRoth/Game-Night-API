const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is not valid');
			}
		}
	},
	password: {
		type: String,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		minlength: 2,
		maxlength: 15
	},
	wins: {
		type: Number,
		default: 0
	},
	eliminations: {
		type: Number,
		default: 0
	},
	currentGames: {
		type: [],
		gameName: {
			type: String
		},
		gameToken: {
			type: String
		}
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

UserSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

UserSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

module.exports = User = mongoose.model('User', UserSchema);
