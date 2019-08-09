const hash = require('password-hash');

module.exports = (api, db, helper) => {
  // check if you are logged in
  api.get('/session', async (req, res) => {
    const user = await helper.get_user(req);
    if (user === null) return res.json({ ok: false });
    return res.json({ ok: true, user });
  });

  // create new session
  api.post('/session', async (req, res) => {
    // { email, password }

    if (!req.body.email || !req.body.password) return res.sendStatus(404);

    const query = await db.query(
      'SELECT id, password FROM users WHERE email=$1 LIMIT 1',
      [req.body.email],
    ).catch(err => console.error(err));

    if (query.rows.length !== 1) return res.json({ ok: false });
    if (!hash.verify(req.body.password, query.rows[0].password)) return res.json({ ok: false });

    const { id } = query.rows[0];
    const user = await helper.create_session(res, id);

    return res.json({
      ok: true,
      user,
    });
  });

  // delete your session
  api.delete('/session', async (req, res) => {
    const session = helper.get_session(req);
    if (!session) return res.json({ ok: false });

    await db.query(
      'DELETE FROM sessions WHERE "session"=$1',
      [session],
    ).catch(err => console.error(err));

    res.clearCookie('session');

    return res.json({ ok: true });
  });
};
