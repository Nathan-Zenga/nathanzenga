import { Photo, Info_text, Design } from '../models/models';

export const getPhotos = async body => {
  const query = { ...body, sort: undefined };
  const sort = JSON.parse(body.sort || "{}");
  if (query.photo_set) query.photo_set = { $regex: RegExp(`^${query.photo_set}$`, "i") };
  const photos = JSON.stringify(await Photo.find(query).lean().sort(sort).exec());
  return JSON.parse(photos);
}

export const getInfoText = async () => {
  const { text } = await Info_text.findOne({}).lean();
  return text;
}

export const getDesignWork = async () => {
  const designs = JSON.stringify(await Design.find({ hidden: false }).lean().sort({ index: 1 }).exec());
  const design_sets = JSON.stringify(await Photo.find({ photo_set: /^design-/ }).lean().sort({ photo_set: 1, orientation: 1, index: 1 }).exec());
  return { designs: JSON.parse(designs), design_sets: JSON.parse(design_sets) };
}