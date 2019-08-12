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
    return res.json({ ok: true, user });
  }

  // create new session
  async post_session(req, res) {
    // { email, password }

    if (!req.body.email || !req.body.password) return res.sendStatus(404);

    const query = await this.db.query(
      'SELECT id, password FROM users WHERE email=$1 LIMIT 1',
      [req.body.email],
    ).catch(err => console.error(err));

    if (query.rows.length !== 1) return res.json({ ok: false });
    if (!hash.verify(req.body.password, query.rows[0].password)) return res.json({ ok: false });

    const { id } = query.rows[0];
    const user = await this.helper.create_session(res, id);

    return res.json({
      ok: true,
      user,
    });
  }

  // delete your session
  async delete_session(req, res) {
    const session = this.helper.get_session(req);
    if (!session) return res.json({ ok: false });

    await this.db.query(
      'DELETE FROM sessions WHERE "session"=$1',
      [session],
    ).catch(err => console.error(err));

    res.clearCookie('session');

    return res.json({ ok: true });
  }
};
