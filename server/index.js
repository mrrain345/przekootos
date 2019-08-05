const express = require('express');
const { Client } = require('pg');

const server = express();
const port = process.env.PORT || 3000;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'qwerty',
  port: 5432,
});

server.get('/', async (req, res) => {
  await client.connect();
  const db = await client.query('SELECT * FROM users');
  const output = db.rows[0];
  await client.end();
  res.json(output);
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});