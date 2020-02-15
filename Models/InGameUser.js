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
		type: [],
		propertyName: {
			type: String,
			required: true
		},
		propertyBuildings: {
			type: Number,
			required: true
		},
		numberOfSetOwned: {
			type: Number,
			required: true
		}
	},
	money: {
		type: Number,
		required: true
	},
	netWorth: {
		type: Number,
		required: true
	}
});

module.exports = InGameUser = mongoose.model('InGameUser', InGameUserSchema);
