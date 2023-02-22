import { connect, connection, Schema } from 'mongoose';
Schema.Types.String.set('trim', true);

const openConnection = async () => connection.readyState === 0 && await connect(process.env.DB);

const newSchema = definition => {
    const schema = new Schema(definition);
    for (const q of [/^find/, /Many$/, "save"]) schema.pre(q, async next => { await openConnection(); next() });
    return schema;
}

export default newSchema;