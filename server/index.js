const Server = require('./Server');
const config = require('./config');
const Session = require('./api/Session');
const Users = require('./api/Users');
const Likes = require('./api/Likes');

const server = new Server([
  new Session(),
  new Users(),
  new Likes(),
], config);

server.run();
