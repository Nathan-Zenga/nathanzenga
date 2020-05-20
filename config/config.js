const cloud = require('cloudinary');
const mongoose = require('mongoose');
const { Photo } = require('../models/models');

/**
 * @typedef UploadApiResponse
 * @type {object}
 * 
 * Callback for upload response.
 * @callback ResponseCallback
 * @param {Error} [err]
 * @param {UploadApiResponse} result
 * 
 * @callback callback
 */

 /**
 * Resizing passed image with smaller dimensions
 * @param {UploadApiResponse} result response object from initial media upload
 * @param {ResponseCallback} cb callback
 */
const DownsizedImage = module.exports.DownsizedImage = (result, cb) => {
    var { width, height, public_id } = result;
    if ( width > 1200 || height > 1200 ) {
        var prop = width >= height ? "width" : "height";
        var options = { crop: "scale" }; options[prop] = 1200;
        var image = cloud.v2.url(public_id, options);
        cloud.v2.uploader.upload(image, { public_id }, cb);
    } else { cb() }
};

/**
 * increment / decrement 'index' field values of all documents, including specified document, greater than that of specified document
 * @param {string} collection name of db collection
 * @param {mongoose.Document} currentDoc specified doc from named collection to apply to query
 * @param {object} [args]
 * @param {Boolean} [args.dec] used as a condition for decrementing index field values (usually after a document is deleted). Otherwise, signals the values to be incremented
 * @param {callback} [cb] callback
 */
module.exports.indexShift = (collection, currentDoc, args, cb) => {
    var _id = currentDoc._id ? {$ne: currentDoc._id} : {};
    mongoose.model(collection).find({index: {$gte: currentDoc.index}, _id}).sort({index: 1}).exec((err, docs) => {
        docs.forEach(doc => {
            doc.index += ((args || {}).dec ? -1 : 1);
            doc.save();
        });
        if (cb) cb(err);
    })
};

/**
 * Re-orders document items by index field number
 * @param {string} collection name of db collection
 * @param {(string|mongoose.Schema.Types.ObjectId)} id identifier for specified document to re-order
 * @param {(string|number)} newIndex new position in which specified doc is placed
 * @param {callback} [cb] callback
 */
module.exports.indexReorder = (collection, id, newIndex, cb) => {
    mongoose.model(collection).find().sort({index: 1}).exec((err, docs) => {
        var docs_mutable = Object.assign([], docs);
        var selected_doc = docs_mutable.filter(e => e._id == id)[0];
        docs_mutable.splice(selected_doc.index, 1);
        docs_mutable.splice(parseInt(newIndex), 0, selected_doc);
        docs_mutable.forEach((doc, i) => {
            if (doc.index != i) doc.index = i;
            doc.save();
        });
        if (cb) cb(err);
    })
};

/**
 * Image uploader
 * @param {object} body custom object or request body in which new image details are contained
 * @param {string} body.file - image url / uri
 * @param {string} body.photo_title - image title
 * @param {string} body.photo_set - set under which the image is categorised
 * @param {number} body.index - image position number
 * @param {callback} [cb] callback
 */
module.exports.photoUploader = (body, cb) => {
    var { file, photo_title, photo_set, index } = body;
    var newPhoto = new Photo({ photo_title, photo_set, index });
    cloud.v2.uploader.upload(file, { public_id: `${photo_set}/${photo_title}`.toLowerCase().replace(/[ ?&#\\%<>]/g, "_") }, (err, result) => {
        if (err) return cb("Error occurred whilst uploading");
        DownsizedImage(result, (err, result2) => {
            if (err) return cb("Error occurred whilst downscaling image");
            var { width, height, secure_url } = result2 || result;
            newPhoto.orientation = width > height ? "landscape" : width < height ? "portrait" : "square";
            newPhoto.photo_url = secure_url;
            newPhoto.save(cb);
        })
    })
}
