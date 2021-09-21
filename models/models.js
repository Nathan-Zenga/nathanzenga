import { model, models, Schema } from 'mongoose';
import { openConnection, closeConnection } from './dbConnect';
Schema.Types.String.set('trim', true);

/**
 * Prepares 'pre' and 'post' hooks for handling DB connections for each mongo query
 * @param {object} definition Schema definition for model fields
 * @returns {Schema} Schema instance with defined hooks
 */
const newSchema = definition => {
    const schema = new Schema(definition);
    const queries = ["find", "findOne", "findOneAndDelete", "findById", "findByIdAndDelete", "deleteMany", "updateMany", "save"];
    for (const query of queries) {
        schema.pre(query, async next => { await openConnection(); next() });
        schema.post(query, async () => { await closeConnection() });
    }
    return schema;
}

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
