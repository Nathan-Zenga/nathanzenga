import { model, models } from 'mongoose';
import Schema from './newSchema';

export const Photo = models.Photo || model('Photo', Schema({
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

export const Design = models.Design || model('Design', Schema({
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

export const Info_text = models.Info_text || model('Info_text', Schema({
    text: String
}));

export const Admin = models.Admin || model('Admin', Schema({
    pass: String
}));
