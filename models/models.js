var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.gallery = mongoose.model('Gallery', Schema({
	tag: String,
	set_id: String,
	label: String,
	index: Number
}));

module.exports.design = mongoose.model('Design', Schema({
	d_id: { type: String, uppercase: true },
	text: {
		client: { type: String },
		tools: { type: String },
		description: { type: String }
	},
	link: String,
	index: Number
}));

module.exports.info_text = mongoose.model('Info_text', Schema({
	text: String
}, {
	capped: { max: 1, size: 1000 }
}));

module.exports.admin = mongoose.model('Admin', Schema({
	pass: String
}, {
	capped: { max: 1, size: 1000 }
}));
