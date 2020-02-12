const mongoose = require('mongoose');
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
		type: [String]
	},
	money: {
		type: Number
	},
	netWorth: {
		type: Number
	}
});

module.exports = InGameUser = mongoose.model('InGameUser', InGameUserSchema);
