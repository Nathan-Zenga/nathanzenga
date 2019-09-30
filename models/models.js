var mongoose = require('mongoose');

module.exports.gallery = mongoose.model('Gallery', mongoose.Schema({
	tag: String,
	set_id: String,
	label: String,
	index: Number
}));

module.exports.design = mongoose.model('Design', mongoose.Schema({
	d_id: { type: String, uppercase: true },
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
