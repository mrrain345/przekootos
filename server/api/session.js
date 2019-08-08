const hash = require('password-hash');
const cryptoRandom = require('crypto-random-string');

module.exports = (server, db, helper) => {
  // check if you are logged in
  server.get('/api/session', async (req, res) => {
    const session = helper.get_settion(req);
    if (!session) return res.json({ ok: false });

    const sess = await db.query(
      'SELECT user, session FROM sessions WHERE session=$1 LIMIT 1',
      [session]
    ).catch(err => console.error(err));

    if (sess.rows.length !== 1) return res.json({ ok: false });
    
    let user = await db.query(
      'SELECT * FROM users WHERE user=$1 LIMIT 1',
      [sess.user]
    ).catch(err => console.error(err));
    user.password = undefined;
    
    return res.json({ ok: true, userdata: user });
  });

  // create new session
  server.post('/api/session', async (req, res) => {
    // { email, password }

    if (!req.body.email || !req.body.password) return res.json({ ok: false });

    const query = await db.query(
      'SELECT * FROM users WHERE email=$1 LIMIT 1',
      [req.body.email]
    ).catch(err => console.error(err));

    if (query.rows.length !== 1) return res.json({ ok: false });
    if (!hash.verify(req.body.password, query.rows[0].password)) return res.json({ ok: false });
    
    let user = query.rows[0];
    user.password = undefined;

    await db.query(
      'INSERT INTO sessions ("user", "session") VALUES ($1, $2)',
      [user.id, session],
    ).catch(err => console.error(err));
    
    const session = cryptoRandom({length: 32});
    const options = {
      maxAge: 1000 * 60 * 60 * 30, // session for 30 days
      httpOnly: true,
      signed: true
    };
    res.cookie('session', session, options);

    return res.json({
      ok: true,
      userdata: user,
      session: session,
    });
  });

  // delete your session
  server.delete('/api/session', async (req, res) => {
    const session = helper.get_settion(req);
    if (!session) return res.json({ ok: false });
    
    await db.query(
      'DELETE sessions WHERE session=$1 LIMIT 1',
      [session]
    ).catch(err => console.error(err));

    res.clearCookie('session');
    
    return res.json({ ok: true });
  });
};