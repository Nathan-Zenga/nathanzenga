const { model, connect, disconnect, connection } = require('mongoose');
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };
// connection handlers mainly used for build stage
const openConnection = async () => connection.readyState === 0 ? await connect(process.env.DB, connectOptions) : null;
const closeConnection = async () => connection.readyState === 1 ? await disconnect() : null;

export const getPhotos = async body => {
  await openConnection();
  const query = { ...body, sort: undefined };
  const sort = JSON.parse(body.sort || "{}");
  if (query.photo_set) query.photo_set = { $regex: RegExp(`^${query.photo_set}$`, "i") };
  const photos = await model("Photo").find(query).lean().sort(sort).exec();
  await closeConnection();
  return JSON.parse(JSON.stringify(photos));
}

export const getInfoText = async () => {
  await openConnection();
  const { text } = await model("Info_text").findOne({}).lean();
  await closeConnection();
  return text;
}

export const getDesignWork = async () => {
  await openConnection();
  const designs = JSON.stringify(await model("Design").find({ hidden: false }).lean().sort({ index: 1 }).exec());
  const design_docs = JSON.stringify(await model("Photo").find({ photo_set: /^design-/ }).lean().sort({ photo_set: 1, orientation: 1, index: 1 }).exec());
  await closeConnection();
  return { designs: JSON.parse(designs), design_docs: JSON.parse(design_docs) };
}