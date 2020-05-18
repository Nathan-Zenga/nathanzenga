const cloud = require('cloudinary');

/**
 * @typedef UploadApiResponse
 * @type {Object}
 * 
 * Callback for upload response.
 * @callback ResponseCallback
 * @param {Error} err
 * @param {UploadApiResponse} result
 */
/**
 * Resizing passed image with smaller dimensions
 * @param {UploadApiResponse} result
 * @param {ResponseCallback} cb
 */
module.exports.DownsizedImage = (result, cb) => {
    var { width, height, public_id } = result;
    if ( width > 1200 || height > 1200 ) {
        var prop = width >= height ? "width" : "height";
        var options = { crop: "scale" }; options[prop] = 1200;
        var image = cloud.v2.url(public_id, options);
        cloud.v2.uploader.upload(image, { public_id }, cb);
    } else { cb() }
};
