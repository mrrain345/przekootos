const validator = require('validator');
const hash = require('password-hash');
const HTTPStatus = require('http-status');

module.exports = class Users {
  routes() {
    this.get('/users', this.get_users);
    this.get('/users/:id', this.get_user);
    this.post('/users', this.post_user);
  }

  // get all users
  async get_users(req, res) {
    const users = await this.models.Users.findAll({
      attributes: { exclude: ['password'] },
      order: [['username', 'ASC']],
    }).catch(err => console.log(err));

    res.json(users);
  }

  // get user
  async get_user(req, res) {
    if (!req.params.id) return res.sendStatus(HTTPStatus.NOT_FOUND);
    const user = await this.models.Users.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    }).catch(err => console.log(err));
    return res.json(user);
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

    const email = await this.models.Users.findOne({
      attributes: ['id'],
      where: { email: req.body.email },
    }).catch(err => console.log(err));

    if (email) {
      errors.push({ code: 8, target: 'email', message: 'Email is used' });
    }

    const ok = errors.length === 0;
    let usr;

    if (ok) {
      const user = await this.models.Users.create({
        username: `${req.body.fname} ${req.body.lname}`,
        password: hash.generate(req.body.password),
        email: req.body.email,
      }).catch(err => console.log(err));

      usr = await this.helper.create_session(res, user.id);
    }

    res.json({ ok, errors, user: usr });
  }
};
