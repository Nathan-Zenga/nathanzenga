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
 * @param {UploadApiResponse} result response object from initial image upload
 * @param {number} result.width width of initial image upload
 * @param {number} result.height height of initial image upload
 * @param {string} result.public_id public ID of initial image upload
 * @param {UploadResponseCallback|callback} cb callback
 */
const DownsizedImage = module.exports.DownsizedImage = (result, cb) => {
    var { width, height, public_id } = result;
    var args = [width, height, public_id];
    if (args.filter(e => e).length != args.length) return cb(new Error("One or more properties / args missing"));
    if ( width > 1200 || height > 1200 ) {
        var prop = width >= height ? "width" : "height";
        var options = { crop: "scale" }; options[prop] = 1200;
        var image = cloud.v2.url(public_id, options);
        cloud.v2.uploader.upload(image, { public_id }, cb);
    } else { cb() }
};

/**
 * increment / decrement 'index' field values of all documents, including specified document, greater than that of specified document
 * @param {string} model model name of db collection
 * @param {mongoose.Document} currentDoc specified doc from named collection to apply to query
 * @param {object} [args]
 * @param {Boolean} [args.dec] used as a condition for decrementing index field values (usually after a document is deleted). Otherwise, signals the values to be incremented
 * @param {callback} [cb] callback
 */
module.exports.indexShift = (model, currentDoc, args, cb) => {
    mongoose.model(model).find({index: {$gte: currentDoc.index}, _id: {$ne: currentDoc._id}}).sort({index: 1}).exec((err, docs) => {
        docs.forEach(doc => {
            doc.index += ((args || {}).dec ? -1 : 1);
            doc.save();
        });
        if (cb) cb(err);
    })
};

/**
 * Re-orders document items by index field number
 * @param {string} model model name of db collection
 * @param {object} args
 * @param {(string|mongoose.Schema.Types.ObjectId)} args.id identifier for specified document to re-order
 * @param {(string|number)} args.newIndex new position in which specified doc is placed
 * @param {object} [args.qry] document filtering query object
 * @param {callback} [cb] callback
 */
module.exports.indexReorder = (model, args, cb) => {
    var { id, newIndex, qry } = args;
    if (!id || !newIndex) return res.send("Required args (ID or new index) missing");
    mongoose.model(model).find(qry || {}).sort({index: 1}).exec((err, docs) => {
        if (err) return console.error(err), res.send("Error occurred during query search"); 
        if (!docs.length) return res.send("Collection not found or doesn't exit");
        var docs_mutable = Object.assign([], docs);
        var selected_doc = docs_mutable.filter(e => e._id == id)[0];
        docs_mutable.splice(selected_doc.index-1, 1);
        docs_mutable.splice(parseInt(newIndex)-1, 0, selected_doc);
        docs_mutable.forEach((doc, i) => {
            if (doc.index != i+1) {
                doc.index = i+1;
                doc.save();
            }
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
 * @param {string} [body.photo_set_new] - new set under which the image is categorised
 * @param {number} body.index - image position number
 * @param {DocumentSaveCallback} [cb] callback
 */
module.exports.photoUploader = (body, cb) => {
    var { file, photo_title, photo_set, photo_set_new, index } = body;
    photo_set = photo_set_new || photo_set;
    var newPhoto = new Photo({ photo_title, photo_set, index });
    var public_id = `${photo_set}/${photo_title}`.toLowerCase().replace(/[ ?&#\\%<>]/g, "_");
    cloud.v2.uploader.upload(file, { public_id }, (err, result) => {
        if (err) return console.error(err), cb("Error occurred whilst uploading");
        DownsizedImage(result, (err, result2) => {
            if (err) return console.error(err), cb("Error occurred whilst downscaling image");
            var { width, height, secure_url } = result2 || result;
            newPhoto.orientation = width > height ? "landscape" : width < height ? "portrait" : "square";
            newPhoto.photo_url = secure_url;
            newPhoto.save(cb);
        })
    })
}
