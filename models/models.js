import { model, models, Schema } from 'mongoose';
import newSchema from './newSchema';
Schema.Types.String.set('trim', true);

module.exports.Photo = models.Photo || model('Photo', newSchema({
    photo_title: String,
    photo_set: String,
    photo_url: String,
    p_id: String,
    r_type: { type: String, enum: ["image", "video"], default: "image" },
    orientation: String,
    index: Number,
    photo_set_cover: { type: Boolean, default: false },
    photo_set_index: Number
}));

module.exports.Design = models.Design || model('Design', newSchema({
    d_id: {
        type: String,
        uppercase: true,
        set: v => v.trim().replace(/[ ._'"]/g, "-")
    },
    text: {
        client: { type: String },
        tools: { type: String },
        description: { type: String }
    },
    images: [{ photo_url: String, index: Number }],
    link: String,
    hidden: { type: Boolean, default: false },
    index: Number
}));

module.exports.Info_text = models.Info_text || model('Info_text', newSchema({
    text: String
}));

module.exports.Admin = models.Admin || model('Admin', newSchema({
    pass: String
}));
