const express = require('express');
const { Client } = require('pg');
const dbConfig = require('./postgres.config');

const server = express();
server.use(express.json());

const port = process.env.PORT || 3000;
const db = new Client(dbConfig);
db.connect();

server.get('/', (req, res) => res.send('Hello world!'));

// REST API
require('./api/users')(server, db);

server.listen(port, () => {
  console.log(`listening on ${port}`);
});