const HTTPStatus = require('http-status');
const crypto = require('crypto');
const authenticator = require('otplib/authenticator');

module.exports = class Authenticator {
  init() {
    authenticator.options = { crypto };
  }

  routes() {
    this.get('/session/2fa', this.is_enabled);
    this.put('/session/2fa', this.set_2fa);
    this.post('/session/2fa', this.authenticate);
  }

  async is_enabled(req, res) {
    const user = await this.helper.get_user(req);
    if (!user) res.sendStatus(HTTPStatus.NOT_FOUND);
    return res.json({ enabled: user.auth_2fa !== null });
  }

  async set_2fa(req, res) {
    const id = await this.helper.get_userid(req);
    const { enable, secret, token } = req.body;
    if (!id) return res.sendStatus(HTTPStatus.NOT_FOUND);
    if (enable !== true && enable !== false) return res.sendStatus(HTTPStatus.BAD_REQUEST);
    if (enable && (!secret || !token)) return res.sendStatus(HTTPStatus.BAD_REQUEST);

    if (enable && !authenticator.check(token, secret)) {
      return res.json({ ok: false, message: 'Bad token' });
    }

    const ok = await this.models.Users.update(
      { auth_2fa: (enable ? secret : null) },
      { where: { id } },
    )
      .then(result => result[0] !== 0)
      .catch(err => console.log(err));

    if (ok) return res.json({ ok: true, enable });
    return res.json({ ok: false, message: 'Database error' });
  }

  async authenticate(req, res) {
    const id = await this.helper.get_userid(req);
    const { token } = req.body;
    if (!id) return res.sendStatus(HTTPStatus.NOT_FOUND);
    if (!token) return res.sendStatus(HTTPStatus.BAD_REQUEST);

    const secret = await this.models.Users.findByPk(id, {
      attributes: ['auth_2fa'],
    })
      .then((auth) => {
        if (!auth) return undefined;
        return auth.dataValues.auth_2fa;
      })
      .catch(err => console.log(err));

    if (secret === undefined) return res.json({ ok: false, code: 2, message: 'Database error' });
    if (secret === null) return res.json({ ok: false, code: 3, message: 'Two-Factor Authentication is disabled' });
    if (!authenticator.check(token, secret)) return res.json({ ok: false, code: 1, message: 'Bad authentication code' });
    return res.json({ ok: true });
  }
};
