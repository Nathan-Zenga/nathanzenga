const { v2: cloud, UploadApiResponse } = require('cloudinary');
const { model, Document: MongooseDocument, Types } = require('mongoose');

 /**
 * Resizing passed image with smaller dimensions
 * @param {UploadApiResponse} result response object from initial image upload
 * @return {Promise<UploadApiResponse>}
 */
const DownsizedImage = module.exports.DownsizedImage = async result => {
    const { width, height, public_id, resource_type } = result;
    const args = [width, height, public_id];
    if (args.filter(e => e).length != args.length) throw Error("One or more properties / args missing");
    if (width < 1200 && height < 1200) return null;
    const options = { crop: "scale", resource_type };
    options[width >= height ? "width" : "height"] = 1200;
    const image = cloud.url(public_id, options);
    return await cloud.uploader.upload(image, { public_id, resource_type });
};

/**
 * increment / decrement 'index' field values of all documents, including specified document, greater than that of specified document
 * @param {string} modelName model name of db collection
 * @param {MongooseDocument} doc specified doc from named collection to apply to query
 * @param {object} [args]
 * @param {boolean} [args.dec] used as a condition for decrementing index field values (usually after a document is deleted). Otherwise, signals the values to be incremented
 */
module.exports.indexShift = async (modelName, doc, args) => {
    const conditions = {}, num = (args || {}).dec ? -1 : 1;
    if (doc.photo_set) conditions.photo_set = doc.photo_set;
    conditions.index = { $gte: doc.index };
    conditions._id = { $ne: doc.id };
    const docs = await model(modelName).find(conditions).sort({index: 1}).exec();
    await Promise.all(docs.map(d => { d.index += num; return d.save() }))
};

/**
 * Re-orders document items by index field number
 * @param {string} modelName model name of db collection
 * @param {object} args
 * @param {(string|Types.ObjectId)} args.id identifier for specified document to re-order
 * @param {(string|number)} args.newIndex new position in which specified doc is placed
 * @param {object} [args.filterQry] document filtering query object
 */
module.exports.indexReorder = async (modelName, args) => {
    const { id, newIndex, filterQry } = args;
    if (!id || !newIndex) throw Error("Required args (ID or new index) missing");
    const docs = await model(modelName).find(filterQry || {}).sort({index: 1}).exec();
    if (!docs.length) throw Error("Collection not found or doesn't exit");
    const index = docs.findIndex(e => e._id == id);
    const beforeSelectedDoc = docs.slice(0, index);
    const afterSelectedDoc = docs.slice(index+1, docs.length);
    const docs_mutable = [...beforeSelectedDoc, ...afterSelectedDoc];
    docs_mutable.splice(parseInt(newIndex)-1, 0, docs[index]);
    await Promise.all(docs_mutable.map((doc, i) => { doc.index = i+1; return doc.save() }))
};

/**
 * Image uploader
 * @param {object} body custom object or request body in which new image details are contained
 * @param {string} body.file - image url / uri
 * @param {string} body.photo_title - image title
 * @param {string} body.photo_set - existing set under which the image is categorised
 * @param {number} body.index - image position number
 */
module.exports.photoUploader = async body => {
    const { file, photo_title, photo_set, index } = body;
    const newPhoto = new model("Photo")({ photo_title, photo_set, index });
    const public_id = `${photo_set}/${photo_title}`.toLowerCase().replace(/[ ?&#\\%<>]/g, "_");
    const result = await cloud.uploader.upload(file, { public_id, resource_type: "auto" });
    const result2 = await DownsizedImage(result).catch(err => ({ err }));
    if (result2.err) { await cloud.api.delete_resources([result.public_id]); throw result2.err }
    const { width, height, secure_url, public_id: p_id, resource_type } = result2 || result;
    newPhoto.orientation = width > height ? "landscape" : width < height ? "portrait" : "square";
    newPhoto.photo_url = secure_url;
    newPhoto.p_id = p_id;
    newPhoto.r_type = resource_type;
    return await newPhoto.save();
}
