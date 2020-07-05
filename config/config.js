const cloud = require('cloudinary');
const mongoose = require('mongoose');
const { Photo } = require('../models/models');

/**
 * @typedef UploadApiResponse
 * @type {object}
 * 
 * Callback for upload response.
 * @callback UploadResponseCallback
 * @param {object} [err] error message / object
 * @param {UploadApiResponse} result upload result
 * 
 * Saves the document (derived from mongoose Document.save method).
 * @callback DocumentSaveCallback
 * @param {object} [err] error message / object
 * @param {mongoose.Document} [document] saved document
 * 
 * @callback callback
 */

 /**
 * Resizing passed image with smaller dimensions
 * @param {(UploadApiResponse|object)} result response object from initial image upload
 * @param {number} result.width width of initial image upload
 * @param {number} result.height height of initial image upload
 * @param {string} result.public_id public ID of initial image upload
 * @param {(UploadResponseCallback|callback)} cb callback
 */
const DownsizedImage = module.exports.DownsizedImage = (result, cb) => {
    var { width, height, public_id } = result;
    var args = [width, height, public_id];
    if (args.filter(e => e).length != args.length) return cb("One or more properties / args missing");
    if ( width > 1200 || height > 1200 ) {
        var prop = width >= height ? "width" : "height";
        var options = { crop: "scale" }; options[prop] = 1200;
        var image = cloud.v2.url(public_id, options);
        cloud.v2.uploader.upload(image, { public_id, resource_type: "auto" }, cb);
    } else { cb() }
};

/**
 * increment / decrement 'index' field values of all documents, including specified document, greater than that of specified document
 * @param {string} model model name of db collection
 * @param {mongoose.Document} doc specified doc from named collection to apply to query
 * @param {object} [args]
 * @param {boolean} [args.dec] used as a condition for decrementing index field values (usually after a document is deleted). Otherwise, signals the values to be incremented
 * @param {callback} [cb] callback
 */
module.exports.indexShift = (model, doc, args, cb) => {
    const conditions = {}, num = (args || {}).dec ? -1 : 1;
    if (doc.photo_set) conditions.photo_set = doc.photo_set;
    conditions.index = { $gte: doc.index };
    conditions._id = { $ne: doc.id };
    mongoose.model(model).find(conditions).sort({index: 1}).exec((err, docs) => {
        if (err) return console.error(err), cb ? cb("Error occurred during query search") : false;
        docs.forEach(d => { d.index += num; d.save() });
        if (cb) cb();
    })
};

/**
 * Re-orders document items by index field number
 * @param {string} model model name of db collection
 * @param {object} args
 * @param {(string|mongoose.Types.ObjectId)} args.id identifier for specified document to re-order
 * @param {(string|number)} args.newIndex new position in which specified doc is placed
 * @param {object} [args.filterQry] document filtering query object
 * @param {callback} [cb] callback
 */
module.exports.indexReorder = (model, args, cb) => {
    var { id, newIndex, filterQry } = args;
    if (!id || !newIndex) return cb ? cb("Required args (ID or new index) missing") : false;
    mongoose.model(model).find(filterQry || {}).sort({index: 1}).exec((err, docs) => {
        if (err) return console.error(err), cb ? cb("Error occurred during query search") : false;
        if (!docs.length) return cb ? cb("Collection not found or doesn't exit") : false;
        var index = docs.findIndex(e => e._id == id);
        var beforeSelectedDoc = docs.slice(0, index);
        var afterSelectedDoc = docs.slice(index+1, docs.length);
        var docs_mutable = [...beforeSelectedDoc, ...afterSelectedDoc];
        docs_mutable.splice(parseInt(newIndex)-1, 0, docs[index]);
        docs_mutable.forEach((doc, i) => {
            doc.index = i+1;
            doc.save();
        });
        if (cb) cb();
    })
};

/**
 * Image uploader
 * @param {object} body custom object or request body in which new image details are contained
 * @param {string} body.file - image url / uri
 * @param {string} body.photo_title - image title
 * @param {string} body.photo_set - existing set under which the image is categorised
 * @param {number} body.index - image position number
 * @param {DocumentSaveCallback} [cb] callback
 */
module.exports.photoUploader = (body, cb) => {
    var { file, photo_title, photo_set, index } = body;
    var newPhoto = new Photo({ photo_title, photo_set, index });
    var public_id = `${photo_set}/${photo_title}`.toLowerCase().replace(/[ ?&#\\%<>]/g, "_");
    cloud.v2.uploader.upload(file, { public_id, resource_type: "auto" }, (err, result) => {
        if (err) return cb ? cb(err.message || "Unable to save image. Error occurred whilst uploading image file / url") : false;
        DownsizedImage(result, (err, result2) => {
            if (err) return cb ? cb(err.message || err || "Unable to save image. Error occurred whilst downscaling image") : false;
            var { width, height, secure_url } = result2 || result;
            newPhoto.orientation = width > height ? "landscape" : width < height ? "portrait" : "square";
            newPhoto.photo_url = secure_url;
            newPhoto.save(cb);
        })
    })
}
