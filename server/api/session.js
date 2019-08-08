const hash = require('password-hash');

module.exports = (server, db, helper) => {
  // check if you are logged in
  server.get('/api/session', async (req, res) => {
    const user = await helper.get_user(req);
    if (user === null) return res.json({ ok: false });
    else return res.json({ ok: true, user: user });
  });

  // create new session
  server.post('/api/session', async (req, res) => {
    // { email, password }

    if (!req.body.email || !req.body.password) return res.json({ ok: false });

    const query = await db.query(
      'SELECT id, password FROM users WHERE email=$1 LIMIT 1',
      [req.body.email]
    ).catch(err => console.error(err));

    if (query.rows.length !== 1) return res.json({ ok: false });
    if (!hash.verify(req.body.password, query.rows[0].password)) return res.json({ ok: false });
    
    const id = query.rows[0].id;
    const user = await helper.create_session(res, id);
    
    return res.json({
      ok: true,
      user: user,
    });
  });

  // delete your session
  server.delete('/api/session', async (req, res) => {
    const session = helper.get_session(req);
    if (!session) return res.json({ ok: false });
    
    await db.query(
      'DELETE FROM sessions WHERE "session"=$1',
      [session]
    ).catch(err => console.error(err));

    res.clearCookie('session');
    
    return res.json({ ok: true });
  });
};