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
    // { fname, lname, password, cpassword, email }
    let errors = [];

    if (!req.body.fname) {
      errors.push({ code: 1, target: 'fname', message: 'First name is required' });
    }

    if (!req.body.lname) {
      errors.push({ code: 2, target: 'lname', message: 'Last name is required' });
    }

    if (!req.body.email) {
      errors.push({ code: 3, target: 'email', message: 'Email is required' });
    }
    else if (!validator.isEmail(req.body.email)) {
      errors.push({ code: 4, target: 'email', message: 'Email is not correct' });
    }

    if (!req.body.password) {
      errors.push({ code: 5, target: 'password', message: 'Password is required' });
    }
    else if (req.body.password.length < 8) {
      errors.push({ code: 6, target: 'password', message: 'Password is too short (min 8 characters)' });
    }

    if (req.body.password !== req.body.cpassword) {
      errors.push({ code: 7, target: 'cpassword', message: 'Passwords do not match' });
    }

    const email = await db.query(
      'SELECT id FROM users WHERE email=$1 LIMIT 1',
      [req.body.email],
    );

    if (email.rows.length !== 0) {
      errors.push({ code: 8, target: 'email', message: 'Email is used' });
    }

    const ok = errors.length === 0;

    if (ok) {
      await db.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
        [req.body.fname + ' ' + req.body.lname, hash.generate(req.body.password), req.body.email],
      );
    }

    res.json({
      ok: ok,
      errors: errors,
    });
  });
};
