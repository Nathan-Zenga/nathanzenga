const { connect, connection, Schema } = require('mongoose');

const openConnection = async () => connection.readyState === 0 ? await connect(process.env.DB) : null;

export default definition => {
    const schema = new Schema(definition);
    const queries = ["find", "findOne", "findOneAndDelete", "findById", "findByIdAndDelete", "deleteMany", "updateMany", "save"];
    for (const query of queries) schema.pre(query, async next => { await openConnection(); next() });
    return schema;
}
