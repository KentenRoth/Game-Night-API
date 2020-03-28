const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 20,
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
		gameID: {
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

UserSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Please check login information');
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('Please check login information');
	}

	return user;
};

UserSchema.methods.createAuthToken = async function() {
	const user = this;
	const token = jwt.sign(
		{
			_id: user._id.toString()
		},
		process.env.WEB_TOKEN
	);

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

UserSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

module.exports = User = mongoose.model('User', UserSchema);
