var mongoose = require('mongoose');

module.exports.gallery = mongoose.model('Gallery', mongoose.Schema({
	key: String,
	set_ID: String,
	label: String
}));

module.exports.design = mongoose.model('Design', mongoose.Schema({
	id: String,
	text: {
		client: { type: String },
		tools: { type: String },
		description: { type: String }
	},
	link: String
}));

module.exports.info_text = mongoose.model('Info_text', mongoose.Schema({
	text: String
}, {
	capped: { max: 1, size: 1000 }
}));
