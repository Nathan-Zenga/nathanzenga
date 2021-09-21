import { Photo, Info_text, Design } from '../models/models';
import { openConnection, closeConnection } from '../services/dbConnect';

export const getPhotos = async body => {
  await openConnection();
  const query = { ...body, sort: undefined };
  const sort = JSON.parse(body.sort || "{}");
  if (query.photo_set) query.photo_set = { $regex: RegExp(`^${query.photo_set}$`, "i") };
  const photos = JSON.stringify(await Photo.find(query).lean().sort(sort).exec());
  await closeConnection();
  return JSON.parse(photos);
}

export const getInfoText = async () => {
  await openConnection();
  const { text } = await Info_text.findOne({}).lean();
  await closeConnection();
  return text;
}

export const getDesignWork = async () => {
  await openConnection();
  const designs = JSON.stringify(await Design.find({ hidden: false }).lean().sort({ index: 1 }).exec());
  const design_docs = JSON.stringify(await Photo.find({ photo_set: /^design-/ }).lean().sort({ photo_set: 1, orientation: 1, index: 1 }).exec());
  await closeConnection();
  return { designs: JSON.parse(designs), design_docs: JSON.parse(design_docs) };
}