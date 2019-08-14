const Server = require('./Server');
const config = require('./config');

const SessionController = require('./controllers/Session');
const UsersController = require('./controllers/Users');
const LikesController = require('./controllers/Likes');

const Sessions = require('./models/Sessions');
const Users = require('./models/Users');
const Likes = require('./models/Likes');

const server = new Server({
  config,
  controllers: [
    new SessionController(),
    new UsersController(),
    new LikesController(),
  ],
  models: {
    Sessions,
    Users,
    Likes,
  },
});

server.run();
