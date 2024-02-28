import { connection, STATES, set } from 'mongoose';

const isDisconnected = () => connection.readyState === STATES.disconnected;
const openConnection = async () => isDisconnected() && set({ strictQuery: true }).connect(process.env.DB);
const connectionHook = schema => { schema.pre(/.*/i, async () => { await openConnection() }) }

export default connectionHook;