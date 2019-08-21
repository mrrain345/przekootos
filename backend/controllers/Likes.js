const Sequelize = require('sequelize');
const HTTPStatus = require('http-status');

const { Op } = Sequelize;

function Timestamp(from, to) {
  if (!isNaN(from) && !isNaN(to)) return { [Op.between]: [from, to] };
  if (!isNaN(from)) return { [Op.gte]: from };
  if (!isNaN(to)) return { [Op.lte]: to };
  return { [Op.not]: null };
}

module.exports = class Likes {
  routes() {
    this.get('/users/all/likes', this.get_all_likes);
    this.get('/users/:id/likes/', this.get_likes);
    this.get('/users/:id/likes/count', this.get_likes_count);
    this.get('/users/:id/like', this.get_like);
    this.put('/users/:id/like', this.put_like);
    this.get('/likes_limit', this.likes_limit_r);
  }

  // Get all likes
  async get_all_likes(req, res) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    const users = [];
    await this.models.Likes.findAll({
      attributes: ['target', [Sequelize.fn('count', '*'), 'count']],
      where: { timestamp: Timestamp(from, to) },
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
              user.likes = parseInt(count, 10);
              users.push(user);
            })
            .catch(err => console.log(err));
          promises.push(promise);
        }
        return Promise.all(promises);
      }).catch(err => console.log(err));

    users.sort((a, b) => b.likes - a.likes);
    return res.json({ users });
  }

  // Get list of user likes
  async get_likes(req, res) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    const target = (req.params.id === 'me') ? await this.helper.get_userid(req) : req.params.id;
    if (!target) return res.sendStatus(HTTPStatus.NOT_FOUND);

    const users = await this.models.Likes.findAll({
      attributes: ['user'],
      where: { target, timestamp: Timestamp(from, to) },
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

  // Get count of user likes
  async get_likes_count(req, res) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    const target = (req.params.id === 'me') ? await this.helper.get_userid(req) : req.params.id;
    if (!target) return res.sendStatus(HTTPStatus.NOT_FOUND);

    const likes = await this.models.Likes.findOne({
      attributes: ['target', [Sequelize.fn('count', '*'), 'count']],
      where: { target, timestamp: Timestamp(from, to) },
      group: ['target'],
    })
      .catch(err => console.log(err));

    if (!likes) res.json({ count: 0 });
    return res.json({ count: likes.dataValues.count });
  }

  // Check if you gave a like today
  async get_like(req, res) {
    if (!req.params.id) return res.sendStatus(HTTPStatus.NOT_FOUND);
    if (req.params.id === 'me') return res.json({ like: false });
    
    const date = new Date();
    const from = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const user = await this.helper.get_userid(req);
    if (!user) return res.sendStatus(HTTPStatus.NOT_FOUND);

    const like = await this.models.Likes.findOne({
      where: { timestamp: { [Op.gte]: from }, user, target: req.params.id },
    }).catch(err => console.log(err));

    return res.json({ like: (like !== null) });
  }

  // Like/Dislike a user
  async put_like(req, res) {
    if (!req.params.id) return res.sendStatus(HTTPStatus.NOT_FOUND);
    const { like } = req.body;
    if (like !== true && like !== false) return res.sendStatus(HTTPStatus.NOT_FOUND);
    
    const date = new Date();
    const from = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const user = await this.helper.get_userid(req);
    if (!user) return res.sendStatus(HTTPStatus.NOT_FOUND);

    const { limit, left } = await this.likes_limit(user);
    if (req.params.id === 'me') return res.json({ like: false, limit, left });
    if (req.params.id === user) return res.json({ like: false, limit, left });

    const liked = await this.models.Likes.findOne({
      where: { timestamp: { [Op.gte]: from }, user, target: req.params.id },
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
      return res.json({ like: true, limit, left: left - 1 });
    }
    await this.models.Likes.destroy({
      where: { id: liked.id },
    }).catch(err => console.log(err));
    return res.json({ like: false, limit, left: left + 1 });
  }

  async likes_limit(id) {
    const date = new Date();
    const from = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const likes = await this.models.Likes.findOne({
      attributes: ['user', [Sequelize.fn('count', '*'), 'count']],
      where: { user: id, timestamp: { [Op.gte]: from } },
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
    const { limit, left } = await this.likes_limit(user);

    return res.json({ ok: true, limit, left });
  }
};
