var { model, Schema } = require('mongoose');

module.exports.Photo = model('Photo', Schema({
    photo_title: String,
    photo_set: String,
    photo_url: String,
    orientation: String,
    index: Number,
    photo_set_cover: { type: Boolean, default: false }
}));

module.exports.Gallery = model('Gallery', Schema({
    tag: String,
    set_id: String,
    label: String,
    index: Number
}));

module.exports.Design = model('Design', Schema({
    d_id: { type: String, uppercase: true },
    text: {
        client: { type: String },
        tools: { type: String },
        description: { type: String }
    },
    link: String,
    index: Number
}));

module.exports.Info_text = model('Info_text', Schema({
    text: String
}, {
    capped: { max: 1, size: 1000 }
}));

module.exports.Admin = model('Admin', Schema({
    pass: String
}, {
    capped: { max: 1, size: 1000 }
}));
