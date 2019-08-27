const hash = require('password-hash');
const HTTPStatus = require('http-status');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

module.exports = class Session {
  routes() {
    this.get('/session', this.get_session);
    this.post('/session', this.post_session);
    this.delete('/session', this.delete_session);
  }

  // check if you are logged in
  async get_session(req, res) {
    const user = await this.helper.get_user(req);
    if (user === null) return res.json({ ok: false });
    await this.helper.refresh_session(req, res);
    return res.json({ ok: true, user });
  }

  // create new session
  async post_session(req, res) {
    // { email, password }

    if (!req.body.email || !req.body.password) return res.sendStatus(HTTPStatus.NOT_FOUND);

    const user = await this.models.Users.findOne({
      where: {
        email: req.body.email,
        password: { [Op.ne]: null },
      },
    }).catch(err => console.log(err));

    if (!user) return res.json({ ok: false });
    if (!hash.verify(req.body.password, user.password)) return res.json({ ok: false });

    const usr = await this.helper.create_session(res, user.id);

    return res.json({
      ok: true,
      user: usr,
    });
  }

  // delete your session
  async delete_session(req, res) {
    const session = this.helper.get_session(req);
    if (!session) return res.json({ ok: false });

    await this.models.Sessions.destroy({
      where: { session },
    }).catch(err => console.log(err));

    res.clearCookie('session');
    return res.json({ ok: true });
  }
};
