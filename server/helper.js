module.exports = (db, cookies) => ({
  cookies: cookies,
  get_session: (req) => {
    const session = req.signedCookies['session'];
    if (!session || session.length !== 32) return null;
    else return session;
  },
  get_user: async (req) => {
    const session = req.signedCookies['session'];
    if (!session || session.length !== 32) return null;
    const query2 = await db.query(
      'SELECT "user" FROM sessions WHERE "session"=$1 LIMIT 1',
      [session]
    ).catch(err => console.error(err));

    const query = await db.query(
      'SELECT * FROM users WHERE id=(SELECT "user" FROM sessions WHERE "session"=$1 LIMIT 1) LIMIT 1',
      [session]
    ).catch(err => console.error(err));
    if (query.rows.length !== 1) return null;
    let user = query.rows[0];
    user.password = undefined;
    return({ id: user.id, userdata: user, session: session });
  },
});