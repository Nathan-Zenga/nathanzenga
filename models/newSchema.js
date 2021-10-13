import { connect, connection, Schema } from 'mongoose';
Schema.Types.String.set('trim', true);

const openConnection = async () => connection.readyState === 0 ? await connect(process.env.DB) : null;

const newSchema = definition => {
    const schema = new Schema(definition);
    const queries = ["find", "findOne", "findOneAndDelete", "findById", "findByIdAndDelete", "deleteMany", "updateMany", "save"];
    for (const q of queries) schema.pre(q, async next => { await openConnection(); next() });
    return schema;
}

export default newSchema;