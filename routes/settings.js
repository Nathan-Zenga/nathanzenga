const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cloud = require('cloudinary');
const async = require('async');
const { Photo, Design, Info_text, Admin } = require('../models/models');
const { indexShift, indexReorder, photoUploader } = require('../config/config');
const production = process.env.NODE_ENV === "production";

router.get('/---', (req, res) => {
    if (req.session.isAuthed || !production) {
        Photo.find().sort({photo_set: 1, index: 1}).exec((err, photos) => {
            Design.find().sort({index: 1}).exec((err, designs) => {
                Info_text.findOne((err, info) => {
                    res.render('settings', { title: "Settings", pagename: "settings", photos, designs, info })
                })
            })
        })
    } else {
        res.redirect("/settings/access");
    }
});

router.get('/access', (req, res) => {
    if (!req.session.isAuthed && production) {
        var flash_msg = req.session.flash_msg;
        res.render('access', { title: "Password Required", pagename: "access", flash_msg }, (err, html) => {
            req.session.flash_msg = undefined;
            res.send(html);
        })
    } else {
        res.redirect("/settings/---")
    }
});

router.post('/*', (req, res, next) => {
    if (req.originalUrl !== "/settings/access" && req.session.isAuthed) req.session.cookie.maxAge = production ? 120000 : Infinity;
    next();
});

router.post('/access', (req, res) => {
    Admin.findOne((err, doc) => {
        bcrypt.compare(req.body.pass, doc.pass, (err, match) => {
            if (match) {
                req.session.cookie.maxAge = 120000; // 2 mins
                req.session.isAuthed = true;
            } else {
                req.session.flash_msg = "Invalid Password";
            }
            res.redirect("/settings/---");
        })
    })
});

router.post('/photo/upload', (req, res) => {
    var { photo_set, photo_set_new, photo_url, index } = req.body;
    Design.findOne({ d_id: photo_set.replace("design-", "") }, (err, design) => {
        if (err) return console.error(err), res.send("Error occurred during query search");
        if (/^design-/.test(photo_set_new || photo_set) && !design) return res.send("Please create Design document first");
        req.body.photo_set = photo_set_new || photo_set;
        photoUploader(req.body, (err, photo) => {
            if (err) return res.send(err);
            indexShift("Photo", photo, { dec: false }, err => {
                if (err) return console.log(err), res.send(err);
                if (design) {
                    index = parseInt(index);
                    design.images.splice(index-1, 0, { photo_url, index });
                    for (let i = 0; i < design.images.length; i++) design.images[i].index = i+1;
                    design.save();
                } else if (photo_set_new) {
                    photo.photo_set_cover = true;
                    photo.photo_set_index = 1;
                    photo.save((err, saved) => {
                        Photo.find({ photo_set_cover: true, _id: {$ne: saved.id} }).sort({photo_set_index: 1}).exec((err, covers) => {
                            covers.forEach((cover, i) => {
                                cover.photo_set_index = i+2;
                                cover.save();
                            })
                        })
                    })
                }
                if (err) console.log(err);
                res.send(err || "Photo saved");
            })
        })
    })
});

router.post('/photo/edit', (req, res) => {
    var { id, photo_title, photo_set } = req.body;
    Photo.findById(id, (err, photo) => {
        if (err) return console.error(err), res.send("Error occurred whilst fetching photo");
        Design.findOne({ d_id: photo_set.replace("design-", "") }, (err, design) => {
            if (err) return console.log(err), res.send("Error occurred whilst checking Design document existence");
            if (/^design-/.test(photo_set) && !design) return res.send("Design document does not exist, please create one first");
            var prev_photo_set = photo.photo_set;
            var sameAsPrevPhotoSet = (new RegExp("^"+photo_set.trim()+"$", "i")).test(prev_photo_set);
            if (photo_set === "Assorted" && !sameAsPrevPhotoSet) {
                let { photo_url, photo_title, index } = photo;
                photoUploader({ photo_title, index, file: photo_url, photo_set: "Assorted" }, (err, saved) => {
                    if (err) return console.log(err), res.send("Error occurred whilst uploading to Assorted");
                    indexShift("Photo", saved, null, err => res.send(err || `Image (${saved.photo_title}) saved in Assorted set`));
                })
            } else {
                if (photo_title) photo.photo_title = photo_title;
                if (photo_set && !sameAsPrevPhotoSet) photo.photo_set = photo_set;
                photo.save((err, edited) => {
                    if (photo_set && !sameAsPrevPhotoSet) {
                        Photo.find({ photo_set }).sort({ index: 1 }).exec((err, set) => {
                            var setCoverPresent = !!set.filter(p => p.photo_set_cover && p.photo_set_index && p.id != edited.id).length;
                            if (photo.photo_set_cover && photo.photo_set_index && setCoverPresent) {
                                edited.photo_set_cover = false;
                                edited.photo_set_index = undefined;
                            }
                            edited.index = set.length + 1;
                            edited.save((err, edited2) => {
                                Photo.find({ photo_set: prev_photo_set }).sort({ index: 1 }).exec((err, photos) => {
                                    var initial_ps_index = photo.photo_set_index;
                                    photos.forEach((p, i) => {
                                        if (i == 0 && photo.photo_set_cover && photo.photo_set_index && !/^design-/.test(photo_set)) {
                                            p.photo_set_cover = true;
                                            p.photo_set_index = initial_ps_index;
                                        }
                                        p.index = i+1;
                                        p.save();
                                    });
                                    if (/^design-/.test(prev_photo_set)) {
                                        Design.findOne({ d_id: prev_photo_set.replace("design-", "") }, (err, prev_design) => {
                                            if (err) { console.log(err) } else if (prev_design) {
                                                prev_design.images = prev_design.images.filter(e => e.photo_url !== edited2.photo_url);
                                                for (let i = 0; i < prev_design.images.length; i++) prev_design.images[i].index = i+1;
                                                prev_design.save();
                                            }
                                        })
                                    }
                                    var msg = `Photo edited and moved to ${photo_set} set successfully`;
                                    if (/^design-/.test(photo_set) && design) {
                                        design.images.push({ photo_url: edited2.photo_url, index: edited2.index });
                                        design.save(() => res.send(msg));
                                    } else {
                                        res.send(msg);
                                    }
                                })
                            })
                        })
                    } else {
                        res.send("Photo edited successfully");
                    }
                })
            }
        })
    })
});

router.post('/photo/delete', (req, res) => {
    var { id } = req.body;
    if (!id) return res.send("Nothing selected");
    Photo.findByIdAndDelete(id, (err, photo) => {
        if (err || !photo) return res.send(err || "Photo not found");
        var { photo_set, photo_title, photo_url, photo_set_cover, photo_set_index } = photo;
        var public_id = `${photo_set}/${photo_title}`.toLowerCase().replace(/[ ?&#\\%<>]/g, "_");
        cloud.v2.api.delete_resources([public_id], err => {
            if (err) return console.log(err), res.send("Error occurred whilst deleting photo");
            Photo.find({ photo_set }).sort({ index: 1 }).exec((err, set) => {
                Design.findOne({ d_id: photo_set.replace("design-", "") }, (err2, design) => {
                    set.forEach((p, i) => {
                        if (i === 0 && photo_set_cover && photo_set_index) {
                            p.photo_set_cover = true;
                            p.photo_set_index = photo_set_index;
                        }
                        p.index = i+1;
                        p.save();
                    });
                    if (!err2 && design) {
                        design.images = design.images.filter(url => url !== photo_url);
                        for (let i = 0; i < design.images.length; i++) design.images[i].index = i+1;
                        design.save();
                    }
                    res.send("Photo deleted");
                })
            })
        })
    })
});

router.post('/photo/sort-order', (req, res) => {
    var { id, index, photo_set } = req.body;
    indexReorder("Photo", { id, newIndex: index, filterQry: { photo_set } }, err => {
        if (err) return res.send(err);
        if (/^design-/.test(photo_set)) {
            Design.findOne({ d_id: photo_set.replace("design-", "") }, (err, design) => {
                if (err) return console.error(err), res.send("Error occurred during query search"); 
                if (!design) return res.send("Design not found");
                Photo.find({ photo_set }).sort({ index: 1 }).exec((err, photos) => {
                    design.images = [];
                    photos.forEach(p => {
                        design.images.push({ photo_url: p.photo_url, index: p.index });
                    });
                    design.save(() => res.send("Photo re-ordered in set: " + photo_set));
                })
            })
        } else { res.send("Photo re-ordered in set: " + photo_set) }
    });
});

router.post('/photo/set/delete', (req, res) => {
    var { photo_set } = req.body;
    if (!photo_set) return res.send("Nothing selected");
    Photo.deleteMany({ photo_set }, err => {
        if (err) return console.log(err), res.send("Error whilst deleting docs");
        cloud.v2.api.delete_resources_by_prefix(photo_set, err => {
            if (err) return console.log(err), res.send("Error whilst deleting photo set");
            Photo.find({photo_set_cover: true}).sort({photo_set_index: 1}).exec((err, covers) => {
                if (/^design-/.test(photo_set)) {
                    var d_id = photo_set.replace("design-", "");
                    Design.findOneAndDelete({ d_id }, (err, design) => {
                        if (err || !design) return res.send(err || d_id + " design set not found");
                        res.send(design.d_id + " design set deleted successfully");
                    })
                } else {
                    covers.forEach((cover, i) => {
                        if (cover.photo_set_index != i+1) {
                            cover.photo_set_index = i+1;
                            cover.save();
                        }
                    });
                    res.send(photo_set + " set deleted successfully")
                }
            })
        })
    })
});

router.post('/photo/set/sort-order', (req, res) => {
    var { photo_set, photo_set_index } = req.body;
    Photo.find({photo_set_cover: true}).sort({photo_set_index: 1}).exec((err, covers) => {
        if (err) return console.error(err), res.send("Error occurred during query search"); 
        if (!covers.length) return res.send("Photo set not found or doesn't exit");
        var index = covers.findIndex(e => e.photo_set == photo_set);
        var beforeSelectedDoc = covers.slice(0, index);
        var afterSelectedDoc = covers.slice(index+1, covers.length);
        var docs_mutable = [...beforeSelectedDoc, ...afterSelectedDoc];
        docs_mutable.splice(parseInt(photo_set_index)-1, 0, docs[index]);
        docs_mutable.forEach((set, i, a) => {
            set.photo_set_index = i+1;
            set.save(() => { if (i === a.length-1) res.send("Photo set cover reordered") })
        })
    })
});

router.post('/photo/set/cover', (req, res) => {
    var { id, photo_set } = req.body;
    if (!id || !photo_set) return res.send("Required field(s) missing");
    Photo.findOne({ photo_set, photo_set_cover: true }, (err, oldCover) => {
        Photo.findById(id, (err2, newCover) => {
            if (err || err2) return console.error(err || err2), res.send("Error occurred whilst fetching image");
            if (!oldCover || !newCover) return res.send("Old / new cover image not found");
            newCover.photo_set_cover = true;
            newCover.photo_set_index = oldCover.photo_set_index;
            newCover.save();
            oldCover.photo_set_cover = false;
            oldCover.photo_set_index = undefined;
            oldCover.save();
            res.send(`Cover image updated for ${photo_set} set`);
        })
    })
});

router.post('/info-text/save', (req, res) => {
    Info_text.findOne((err, info) => {
        var newInfo = info ? info : new Info_text();
        newInfo.text = req.body.text;
        newInfo.save(err2 => {
            if (err || err2) console.log(err || err2);
            res.send(err ? "Error occurred whilst fetching info" : err2 ? "Error occurred whilst saving info" : "Info text saved");
        });
    });
});

router.post('/design/save', (req, res) => {
    var { d_id, client, tools, description, link, index, images } = req.body;
    var newDesign = new Design({ d_id, text: { client, tools, description }, link, index });
    Design.findOne({ d_id: {$regex: new RegExp(d_id, "i")} }, (err, found) => {
        if (err || found) return res.send(err || "Design set already exists");
        indexShift("Design", newDesign, { dec: false }, err => {
            if (err) return console.log(err), res.send(err);
            newDesign.save((err, design) => {
                design.images = [];
                images = (Array.isArray(images) ? images : [images]).filter(e => e);
                async.forEachOf(images, (file, i, cb) => {
                    var photo_set = `design-${design.d_id}`;
                    var photo_title = `${design.d_id}-web${i ? "-" + (i+1) : ""}`;
                    var index = i+1;
                    photoUploader({ file, photo_title, photo_set, index }, (err, photo) => {
                        if (err) return cb(err);
                        design.images.push({ photo_url: photo.photo_url, index: photo.index });
                        if (i === images.length-1) design.save();
                        cb();
                    });
                }, err => { if (err) console.log(err); res.send(err || "Design saved") });
            });
        });
    })
});

// router.post('/design/delete', (req, res) => {
//     var { id } = req.body;
//     (Array.isArray(id) ? id : [id]).filter(e => e).forEach(id => {
//         Design.findByIdAndDelete(id, (err, design) => {
//             if (err) return console.error(err), res.send(err);
//             var { d_id } = design;
//             Photo.deleteMany({ photo_set: `design-${ d_id }` }, err => {
//                 if (err) return console.error(err), res.send(err);
//                 cloud.v2.api.delete_resources_by_prefix(`design-${ d_id }`, {}, err => {
//                     if (err) return console.error(err), res.send(err);
//                     res.send("Design deleted successfully");
//                 })
//             })
//         })
//     });
// });

router.post('/design/sort-order', (req, res) => {
    var { id, index } = req.body;
    indexReorder("Design", { id, newIndex: index }, err => { console.log(err || ""); res.send(err ? "Error occured" : "Design set re-ordered") });
});

router.post('/design/edit', (req, res) => {
    var { id, d_id, client, tools, description, link } = req.body;
    var msg = "";
    Design.findById(id, (err, doc) => {
        if (err) return console.error(err), res.send("Error occurred whilst fetching design doc");
        if (client) doc.text.client = client;
        if (tools) doc.text.tools = tools;
        if (description) doc.text.description = description;
        if (link) doc.link = link;
        if (d_id) {
            Photo.updateMany({photo_set: `design-${doc.d_id}`}, {$set: {photo_set: `design-${d_id}`}}, (err, result) => {
                if (err) return console.error(err), res.send("Error occurred whilst photos updating photo set");
                console.log(result);
                var { n, nModified } = result;
                if (n === nModified && nModified > 0) {
                    doc.d_id = d_id;
                } else {
                    msg = ".\nNone or some of the d_id fields were modified";
                }
                doc.save(err => res.send("Design collection updated" + msg));
            });
        } else { doc.save(err => res.send("Design collection updated")) }
    });
});

router.post('/design/docs', (req, res) => Design.find((err, designs) => res.send(designs)));

module.exports = router;
