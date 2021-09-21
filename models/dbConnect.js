const { connect, disconnect, connection } = require('mongoose');

export const openConnection = async () => connection.readyState === 0 ? await connect(process.env.DB) : null;
export const closeConnection = async () => connection.readyState === 1 ? await disconnect() : null;
