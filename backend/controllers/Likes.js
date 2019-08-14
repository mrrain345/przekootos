const Sequelize = require('sequelize');

const { Op } = Sequelize;

module.exports = class Likes {
  routes() {
    this.get('/users/all/likes/:time?', this.get_all_likes);
    this.get('/users/:id/likes/:time?', this.get_likes);
    this.get('/users/:id/likes/:time/count', this.get_likes_count);
    this.get('/users/:id/like', this.get_like);
    this.put('/users/:id/like', this.put_like);
    this.get('/likes_limit', this.likes_limit_r);
  }

  async get_timestamp(time) {
    return this.sequelize.query(`SELECT DATE_TRUNC('${time}', CURRENT_TIMESTAMP)::timestamptz AS time`, { type: Sequelize.QueryTypes.SELECT })
      .then(res => res[0].time)
      .catch(err => console.log(err));
  }

  // Get all likes (time: day/week/month/year/all, default: all)
  async get_all_likes(req, res) {
    const time = (!req.params.time) ? 'all' : req.params.time;
    if (!['day', 'week', 'month', 'year', 'all'].includes(time)) return res.sendStatus(404);
    const timestamp = (time !== 'all')
      ? { [Op.gte]: await this.get_timestamp(time) }
      : { [Op.not]: null };

    let users = [];
    await this.models.Likes.findAll({
      attributes: ['target', [Sequelize.fn('count', '*'), 'count']],
      where: { timestamp },
      group: ['target'],
      order: [[Sequelize.literal('"count"'), 'DESC']],
    })
      .then((likes) => {
        const promises = [];
        for (let i = 0; i < likes.length; i += 1) {
          const { target, count } = likes[i].dataValues;
          const promise = this.models.Users.findByPk(target, {
            attributes: { exclude: ['password'] },
          })
            .then((usr) => {
              const user = usr.dataValues;
              user.likes = parseInt(count);
              users.push(user);
            })
            .catch(err => console.log(err));
          promises.push(promise);
        }
        return Promise.all(promises);
      }).catch(err => console.log(err));

    users.sort((a, b) => { return b.likes - a.likes });
    return res.json({ users });
  }

  // Get list of user likes (time: day/week/month/year/all, default: all)
  async get_likes(req, res) {
    const time = (!req.params.time) ? 'all' : req.params.time;
    if (!['day', 'week', 'month', 'year', 'all'].includes(time)) return res.sendStatus(404);
    const target = (req.params.id === 'me') ? await this.helper.get_userid(req) : req.params.id;
    if (!target) return res.sendStatus(404);
    const timestamp = (time !== 'all')
      ? { [Op.gte]: await this.get_timestamp(time) }
      : { [Op.not]: null };

    const users = await this.models.Likes.findAll({
      attributes: ['user'],
      where: { target, timestamp },
    })
      .then((likes) => {
        const ids = [];
        likes.forEach(like => ids.push(like.user));
        return this.models.Users.findAll({
          attributes: { exclude: ['password'] },
          where: { id: ids },
          order: [['username', 'ASC']],
        });
      })
      .catch(err => console.log(err));

    return res.json({ likes: users, count: users.length });
  }

  // Get count of user likes (time: day/week/month/year/all)
  async get_likes_count(req, res) {
    if (!['day', 'week', 'month', 'year', 'all'].includes(req.params.time)) return res.sendStatus(404);
    const target = (req.params.id === 'me') ? await this.helper.get_userid(req) : req.params.id;
    if (!target) return res.sendStatus(404);
    const timestamp = (req.params.time !== 'all')
      ? { [Op.gte]: await this.get_timestamp(req.params.time) }
      : { [Op.not]: null };

    const likes = await this.models.Likes.findOne({
      attributes: ['target', [Sequelize.fn('count', '*'), 'count']],
      where: { target, timestamp },
      group: ['target'],
    })
      .catch(err => console.log(err));

    if (!likes) res.json({ count: 0 });
    return res.json({ count: likes.dataValues.count });
  }

  // Check if you gave a like today
  async get_like(req, res) {
    if (!req.params.id) return res.sendStatus(404);
    if (req.params.id === 'me') return res.json({ like: false });
    const timestamp = { [Op.gte]: await this.get_timestamp('day') };

    const user = await this.helper.get_userid(req);
    if (!user) return res.sendStatus(404);

    const like = await this.models.Likes.findOne({
      where: { timestamp, user, target: req.params.id },
    }).catch(err => console.log(err));

    return res.json({ like: (like !== null) });
  }

  // Like/Dislike a user
  async put_like(req, res) {
    if (!req.params.id) return res.sendStatus(404);
    const { like } = req.body;
    if (like !== true && like !== false) return res.sendStatus(404);
    const timestamp = { [Op.gte]: await this.get_timestamp('day') };

    const user = await this.helper.get_userid(req);
    if (!user) return res.sendStatus(404);

    const { limit, left } = await this.likes_limit(user);
    if (req.params.id === 'me') return res.json({ like: false, limit, left });
    if (req.params.id === user) return res.json({ like: false, limit, left });

    const liked = await this.models.Likes.findOne({
      where: { timestamp, user, target: req.params.id },
    }).catch(err => console.log(err));

    if (!like === !liked) return res.json({ like, limit, left });

    if (like) {
      if (!left) {
        return res.json({ like: false, limit, left });
      }

      await this.models.Likes.create({
        user,
        target: req.params.id,
      }).catch(err => console.log(err));
      return res.json({ like: true, limit, left: left-1 });
    }
    await this.models.Likes.destroy({
      where: { id: liked.id },
    }).catch(err => console.log(err));
    return res.json({ like: false, limit, left: left+1 });
  }

  async likes_limit(id) {
    const timestamp = { [Op.gte]: await this.get_timestamp('day') };

    const likes = await this.models.Likes.findOne({
      attributes: ['user', [Sequelize.fn('count', '*'), 'count']],
      where: { user: id, timestamp },
      group: ['user'],
    }).catch(err => console.log(err));

    const limit = this.config.likes_limit;
    if (!likes) return { limit, left: limit };

    const left = (likes.dataValues.count > limit) ? 0 : (limit - likes.dataValues.count);
    return { limit, left };
  }

  async likes_limit_r(req, res) {
    const user = await this.helper.get_userid(req);
    if (!user) return res.json({ ok: false, limit: this.config.likes_limit });
    const { limit, left } = await this.likes_limit(user)

    return res.json({ ok: true, limit, left });
  }
};
