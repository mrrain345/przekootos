const validator = require('validator');
const hash = require('password-hash');

module.exports = (server, db) => {
  // get all users
  server.get('/api/user/', async (req, res) => {
    const query = await db.query('SELECT * FROM users');
    res.json(query.rows);
  });
  
  // get user
  server.get('/api/user/:id', async (req, res) => {
    const query = await db.query('SELECT * FROM users WHERE id=$1', [req.params.id]);
    res.json(query.rows[0]);
  });

  // add new user
  server.post('/api/user', async (req, res) => {
    // { username, password, confirm_password, email }
    if (!req.body.username) {
      res.json({ code: 1, message: 'Username is required' });
      return;
    }

    if (req.body.username.length < 3) {
      res.json({ code: 2, message: 'Username is too short (min: 3 characters)' });
      return;
    }

    if (!req.body.password) {
      res.json({ code: 3, message: 'Password is required' });
      return;
    }

    if (req.body.password.length < 8) {
      res.json({ code: 4, message: 'Password is too short (min 8 characters)' });
      return;
    }

    if (req.body.password !== req.body.confirm_password) {
      res.json({ code: 5, message: 'Passwords do not match' });
      return;
    }

    if (!req.body.email) {
      res.json({ code: 6, message: 'Email is required' });
      return;
    }

    if (!validator.isEmail(req.body.email)) {
      res.json({ code: 7, message: 'Email is not correct' });
      return;
    }

    const query = await db.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
      [req.body.username, hash.generate(req.body.password), req.body.email]
    );
    res.json({ code: 0, message: 'success' });
  });
}