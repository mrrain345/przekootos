const express = require('express');

const server = express();
const port = process.env.PORT || 3000;

server.get('/', (req, res) => {
  res.json({
    message: 'Hello world'
  });
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});