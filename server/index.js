const express = require('express');
const cookies = require('cookie-parser');
const { Client } = require('pg');
const config = require('./config');

const server = express();
server.use(express.json());
server.use(cookies(config.cookieSecret));

const port = process.env.PORT || 3000;
const db = new Client(config.postgres);
db.connect();

const helper = require('./helper')(db, cookies);

const api = express.Router();

// REST API
require('./api/session')(api, db, helper);
require('./api/users')(api, db, helper);
require('./api/users.likes')(api, db, helper);

server.use('/api', api);

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
