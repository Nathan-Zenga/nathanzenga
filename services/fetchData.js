import { Photo, Info_text, Design } from '../models/models';

export const getPhotos = async body => {
  const query = { ...body };
  delete query.sort;
  if (typeof query.photo_set == "string") query.photo_set = { $regex: RegExp(`^${query.photo_set.replace(/_|\-| /g, "\\W?")}$`, "i") };
  const docs = await Photo.find(query).lean().sort(body.sort || {}).exec();
  const photos = JSON.parse(JSON.stringify(docs));
  return photos;
}

export const getInfoText = async () => {
  const info_text = await Info_text.findOne({}).lean();
  return info_text?.text || "";
}

export const getDesignWork = async () => {
  var designs = await Design.find({ hidden: false }).lean().sort({ index: 1 }).exec();
  var design_sets = await Photo.find({ photo_set: /^design-/ }).lean().sort({ photo_set: 1, orientation: 1, index: 1 }).exec();
  designs = JSON.parse(JSON.stringify(designs));
  design_sets = JSON.parse(JSON.stringify(design_sets));
  return { designs, design_sets };
}