module.exports = class Likes {
  routes() {
    this.get('/users/all/likes/:time?', this.get_all_likes);
    this.get('/users/:id/likes/:time?', this.get_likes);
    this.get('/users/:id/likes/:time/count', this.get_likes_count);
    this.get('/users/:id/like', this.get_like);
    this.put('/users/:id/like', this.put_like);
  }

  // Get all likes (time: day/week/month/year/all, default: all)
  async get_all_likes(req, res) {
    const time = (!req.params.time) ? 'all' : req.params.time;
    if (!['day', 'week', 'month', 'year', 'all'].includes(time)) return res.sendStatus(404);

    const query = (time !== 'all')
      ? await this.db.query(
        'SELECT target AS id, (SELECT username FROM users WHERE id=target), (SELECT email FROM users WHERE id=target), count(*) AS likes FROM likes WHERE timestamp >= DATE_TRUNC($1, CURRENT_TIMESTAMP) GROUP BY target ORDER BY likes DESC, username ASC',
        [time],
      ).catch(err => console.error(err))
      : await this.db.query(
        'SELECT target AS id, (SELECT username FROM users WHERE id=target), (SELECT email FROM users WHERE id=target), count(*) AS likes FROM likes GROUP BY target ORDER BY likes DESC, username ASC',
      ).catch(err => console.error(err));

    return res.json({ users: query.rows });
  }

  // Get list of user likes (time: day/week/month/year/all, default: all)
  async get_likes(req, res) {
    const time = (!req.params.time) ? 'all' : req.params.time;
    if (!['day', 'week', 'month', 'year', 'all'].includes(time)) return res.sendStatus(404);
    const target = (req.params.id === 'me') ? await this.helper.get_userid(req) : req.params.id;
    if (!target) return res.sendStatus(404);

    const query = (time !== 'all')
      ? await this.db.query(
        'SELECT id, username, email FROM users WHERE id IN (SELECT "user" FROM likes WHERE target=$1 AND timestamp >= DATE_TRUNC($2, CURRENT_TIMESTAMP))',
        [target, time],
      ).catch(err => console.error(err))
      : await this.db.query(
        'SELECT id, username, email FROM users WHERE id IN (SELECT "user" FROM likes WHERE target=$1)',
        [target],
      ).catch(err => console.error(err));

    return res.json({ likes: query.rows, count: query.rows.length });
  }

  // Get count of user likes (time: day/week/month/year/all)
  async get_likes_count(req, res) {
    if (!['day', 'week', 'month', 'year', 'all'].includes(req.params.time)) return res.sendStatus(404);
    const target = (req.params.id === 'me') ? await this.helper.get_userid(req) : req.params.id;
    if (!target) return res.sendStatus(404);

    const query = await this.db.query(
      'SELECT count(*) AS count FROM likes WHERE target=$1 AND timestamp >= DATE_TRUNC($2, CURRENT_TIMESTAMP)',
      [target, req.params.time],
    ).catch(err => console.error(err));

    if (query.rows.length === 0) res.json({ likes: 0 });
    return res.json({ count: query.rows[0].count });
  }

  // Check if you gave a like today
  async get_like(req, res) {
    if (!req.params.id) return res.sendStatus(404);
    if (req.params.id === 'me') return res.json({ like: false });

    const userid = await this.helper.get_userid(req);
    if (!userid) return res.sendStatus(404);

    const query = await this.db.query(
      'SELECT * FROM likes WHERE "user"=$1 AND target=$2 AND timestamp >= DATE_TRUNC(\'day\', CURRENT_TIMESTAMP)',
      [userid, req.params.id],
    ).catch(err => console.error(err));

    if (query.rows.length === 0) return res.json({ like: false });
    return res.json({ like: true });
  }

  // Like/Dislike a user
  async put_like(req, res) {
    if (!req.params.id) return res.sendStatus(404);
    const { like } = req.body;
    if (like !== true && like !== false) return res.sendStatus(404);

    const userid = await this.helper.get_userid(req);
    if (!userid) return res.sendStatus(404);

    if (req.params.id === 'me') return res.json({ like: false });
    if (req.params.id === userid) return res.json({ like: false });

    const query = await this.db.query(
      'SELECT * FROM likes WHERE "user"=$1 AND target=$2 AND timestamp >= DATE_TRUNC(\'day\', CURRENT_TIMESTAMP)',
      [userid, req.params.id],
    ).catch(err => console.error(err));

    const liked = (query.rows.length !== 0);

    if (like === liked) return res.json({ like });

    if (like) {
      await this.db.query(
        'INSERT INTO likes ("user", "target") VALUES ($1, $2)',
        [userid, req.params.id],
      ).catch(err => console.error(err));

      return res.json({ like: true });
    }
    await this.db.query(
      'DELETE FROM likes WHERE "user"=$1 AND "target"=$2',
      [userid, req.params.id],
    ).catch(err => console.error(err));

    return res.json({ like: false });
  }
};
