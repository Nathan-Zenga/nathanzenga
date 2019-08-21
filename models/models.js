var mongoose = require('mongoose');

module.exports.gallery = mongoose.model('Gallery', mongoose.Schema({
	gallery: String,
	label: String
}));

module.exports.design = mongoose.model('Design', mongoose.Schema({
	id: String,
	link: String,
	text: String
}));

module.exports.info_text = mongoose.model('Info-Text', mongoose.Schema({
	body: String
}));
