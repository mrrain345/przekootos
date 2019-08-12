const validator = require('validator');
const hash = require('password-hash');

module.exports = class Users {
  routes() {
    this.get('/users', this.get_users);
    this.get('/users/:id', this.get_user);
    this.post('/users', this.post_user);
  }

  // get all users
  async get_users(req, res) {
    const query = await this.db.query('SELECT * FROM users ORDER BY username ASC');
    for (let i = 0; i < query.rows.length; i += 1) {
      query.rows[i].password = undefined;
    }
    res.json(query.rows);
  }

  // get user
  async get_user(req, res) {
    if (!req.params.id) return res.sendStatus(404);
    const query = await this.db.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [req.params.id]);
    if (query.rows.length !== 1) return res.sendStatus(404);
    query.rows[0].password = undefined;
    return res.json(query.rows[0]);
  }

  // add new user
  async post_user(req, res) {
    // { fname, lname, password, cpassword, email }
    const errors = [];

    if (!req.body.fname) {
      errors.push({ code: 1, target: 'fname', message: 'First name is required' });
    }

    if (!req.body.lname) {
      errors.push({ code: 2, target: 'lname', message: 'Last name is required' });
    }

    if (!req.body.email) {
      errors.push({ code: 3, target: 'email', message: 'Email is required' });
    } else if (!validator.isEmail(req.body.email)) {
      errors.push({ code: 4, target: 'email', message: 'Email is not correct' });
    }

    if (!req.body.password) {
      errors.push({ code: 5, target: 'password', message: 'Password is required' });
    } else if (req.body.password.length < 8) {
      errors.push({ code: 6, target: 'password', message: 'Password is too short (min 8 characters)' });
    }

    if (req.body.password !== req.body.cpassword) {
      errors.push({ code: 7, target: 'cpassword', message: 'Passwords do not match' });
    }

    const email = await this.db.query(
      'SELECT id FROM users WHERE email=$1 LIMIT 1',
      [req.body.email],
    ).catch(err => console.error(err));

    if (email.rows.length !== 0) {
      errors.push({ code: 8, target: 'email', message: 'Email is used' });
    }

    const ok = errors.length === 0;
    let user;

    if (ok) {
      const query = await this.db.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
        [`${req.body.fname} ${req.body.lname}`, hash.generate(req.body.password), req.body.email],
      ).catch(err => console.error(err));

      user = await this.helper.create_session(res, query.rows[0].id);
    }

    res.json({
      ok,
      errors,
      user,
    });
  }
};
