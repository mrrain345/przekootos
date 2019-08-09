module.exports = (api, db, helper) => {
  // Get all likes (time: day/week/month/year/all, default: all)
  api.get('/users/all/likes/:time?', async (req, res) => {
    const time = (!req.params.time) ? 'all' : req.params.time;
    if (!['day', 'week', 'month', 'year', 'all'].includes(time)) return res.sendStatus(404);

    const query = (time !== 'all')
      ? await db.query(
        'SELECT target AS id, (SELECT username FROM users WHERE id=target), (SELECT email FROM users WHERE id=target), count(*) AS likes FROM likes WHERE timestamp >= DATE_TRUNC($1, CURRENT_TIMESTAMP) GROUP BY target',
        [time],
      ).catch(err => console.error(err))
      : await db.query(
        'SELECT target AS id, (SELECT username FROM users WHERE id=target), (SELECT email FROM users WHERE id=target), count(*) AS likes FROM likes GROUP BY target',
      ).catch(err => console.error(err));

    return res.json({ users: query.rows });
  });

  // Get list of user likes (time: day/week/month/year/all, default: all)
  api.get('/users/:id/likes/:time?', async (req, res) => {
    const time = (!req.params.time) ? 'all' : req.params.time;
    if (!['day', 'week', 'month', 'year', 'all'].includes(time)) return res.sendStatus(404);
    const target = (req.params.id === 'me') ? await helper.get_userid(req) : req.params.id;
    if (!target) return res.sendStatus(404);

    const query = (time !== 'all')
      ? await db.query(
        'SELECT id, username, email FROM users WHERE id IN (SELECT "user" FROM likes WHERE target=$1 AND timestamp >= DATE_TRUNC($2, CURRENT_TIMESTAMP))',
        [target, time],
      ).catch(err => console.error(err))
      : await db.query(
        'SELECT id, username, email FROM users WHERE id IN (SELECT "user" FROM likes WHERE target=$1)',
        [target],
      ).catch(err => console.error(err));

    return res.json({ likes: query.rows, count: query.rows.length });
  });

  // Get count of user likes (time: day/week/month/year/all)
  api.get('/users/:id/likes/:time/count', async (req, res) => {
    if (!['day', 'week', 'month', 'year', 'all'].includes(req.params.time)) return res.sendStatus(404);
    const target = (req.params.id === 'me') ? await helper.get_userid(req) : req.params.id;
    if (!target) return res.sendStatus(404);

    const query = await db.query(
      'SELECT count(*) AS count FROM likes WHERE target=$1 AND timestamp >= DATE_TRUNC($2, CURRENT_TIMESTAMP)',
      [target, req.params.time],
    ).catch(err => console.error(err));

    if (query.rows.length === 0) res.json({ likes: 0 });
    return res.json({ count: query.rows[0].count });
  });

  // Check if you gave a like today
  api.get('/users/:id/like', async (req, res) => {
    if (!req.params.id) return res.sendStatus(404);
    if (req.params.id === 'me') return res.json({ like: false });

    const userid = await helper.get_userid(req);
    if (!userid) return res.sendStatus(404);

    const query = await db.query(
      'SELECT * FROM likes WHERE "user"=$1 AND target=$2 AND timestamp >= DATE_TRUNC(\'day\', CURRENT_TIMESTAMP)',
      [userid, req.params.id],
    ).catch(err => console.error(err));

    if (query.rows.length === 0) return res.json({ like: false });
    return res.json({ like: true });
  });

  // Like/Dislike a user
  api.put('/users/:id/like', async (req, res) => {
    if (!req.params.id) return res.sendStatus(404);
    const like = req.body.like;
    if (like !== true && like !== false) return res.sendStatus(404);
    
    const userid = await helper.get_userid(req);
    if (!userid) return res.sendStatus(404);

    if (req.params.id === 'me') return res.json({ like: false });
    if (req.params.id === userid) return res.json({ like: false });
    
    const query = await db.query(
      'SELECT * FROM likes WHERE "user"=$1 AND target=$2 AND timestamp >= DATE_TRUNC(\'day\', CURRENT_TIMESTAMP)',
      [userid, req.params.id],
    ).catch(err => console.error(err));

    const liked = (query.rows.length !== 0);

    if (like === liked) return res.json({ like: like });

    if (like) {
      await db.query(
        'INSERT INTO likes ("user", "target") VALUES ($1, $2)',
        [userid, req.params.id],
      ).catch(err => console.error(err));

      return res.json({ like: true });
    } else {
      await db.query(
        'DELETE FROM likes WHERE "user"=$1 AND "target"=$2',
        [userid, req.params.id],
      ).catch(err => console.error(err));

      return res.json({ like: false });
    }
  });
};
