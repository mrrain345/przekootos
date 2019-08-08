const cryptoRandom = require('crypto-random-string');

module.exports = (db, cookies) => ({
  cookies,
  get_session: (req) => {
    const { session } = req.signedCookies;
    if (!session || session.length !== 32) return null;
    return session;
  },
  get_user: async (req) => {
    const { session } = req.signedCookies;
    if (!session || session.length !== 32) return null;

    const query = await db.query(
      'SELECT * FROM users WHERE id=(SELECT "user" FROM sessions WHERE "session"=$1 LIMIT 1) LIMIT 1',
      [session],
    ).catch(err => console.error(err));

    if (query.rows.length !== 1) return null;
    const user = query.rows[0];
    user.password = undefined;
    return { id: user.id, userdata: user, session };
  },
  create_session: async (res, id) => {
    const query = await db.query(
      'SELECT * FROM users WHERE id=$1 LIMIT 1',
      [id],
    ).catch(err => console.error(err));

    if (query.rows.length !== 1) return null;

    const user = query.rows[0];
    user.password = undefined;

    const session = cryptoRandom({ length: 32 });

    await db.query(
      'INSERT INTO sessions ("user", "session") VALUES ($1, $2)',
      [user.id, session],
    ).catch(err => console.error(err));

    res.cookie('session', session, {
      maxAge: 1000 * 60 * 60 * 30, // session for 30 days
      httpOnly: true,
      signed: true,
    });

    return {
      id: user.id,
      userdata: user,
      session,
    };
  },
});
