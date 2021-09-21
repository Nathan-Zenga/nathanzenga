const prod = process.env.NODE_ENV === "production";
const { connect, disconnect, connection } = require('mongoose');

export const openConnection = async () => prod && connection.readyState === 0 ? await connect(process.env.DB) : null;
export const closeConnection = async () => prod && connection.readyState === 1 ? await disconnect() : null;
