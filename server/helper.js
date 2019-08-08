module.exports = (db, cookies) => ({
  cookies: cookies,
  get_settion: async (req) => {
    const session = req.signedCookies['session'];
    if (!session || session.length !== 32) return null;
    const query = await db.query(
      "SELECT sessions.user AS id, users.username AS username FROM sessions LEFT JOIN users ON sessions.user=users.id WHERE session=? LIMIT 1",
      [session]
    );
    if (query.rows.length !== 1) return null;
    const user = query.rows[0];
    return({ id: user.id, username: user.username, session: session });
  },
});