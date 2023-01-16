const { Server } = require('socket.io');
const uaParser = require('../config/ua-parser');

const visitor = ({ request: req, handshake: { headers } }) => {
  const { browser, os, device } = new uaParser(headers['user-agent']).getResult();
  const url = new URL(headers.referer);
  const ua = `browser: ${browser.name} ${browser.version}, os: ${os.name} ${os.version}, device: ${device.type}`.replace(/ ?undefined ?/g, "");
  return `method: ${req.method}, status: ${req.statusCode} (${req.statusMessage}), host: ${url.host}, path: ${url.pathname}, ${ua}`;
};

const socketHandler = server => {
  const io = new Server(server);
  io.on('connection', socket => { console.log(visitor(socket)) })
}

module.exports = socketHandler;