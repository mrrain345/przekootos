const hash = require('password-hash');

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
    // { email, password, token? }

    if (!req.body.email || !req.body.password) {
      return res.json({ ok: false, code: 1, message: 'User does not exist' });
    }

    const user = await this.models.Users.findOne({
      where: { email: req.body.email },
    }).catch(err => console.log(err));

    if (!user) return res.json({ ok: false, code: 1, message: 'User does not exist' });
    if (!hash.verify(req.body.password, user.password)) {
      return res.json({ ok: false, code: 1, message: 'User does not exist' });
    }
    if (user.registration_code !== null) {
      return res.json({ ok: false, code: 2, message: 'User is not verified' });
    }

    if (user.auth_2fa !== null && !req.body.token) {
      return res.json({ ok: false, code: 3, message: '2fa token is undefined' });
    }

    const usr = await this.helper.create_session(res, user.id, req.body.token);
    if (!usr.error) return res.json({ ok: true, user: usr });
    return res.json({ ok: false, code: usr.error.code + 1, message: usr.error.message });
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
