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

// REST API
require('./api/users')(server, db, helper);
require('./api/session')(server, db, helper);

server.listen(port, () => {
  console.log(`listening on ${port}`);
});