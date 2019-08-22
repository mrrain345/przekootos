const Sequelize = require('sequelize');
const HTTPStatus = require('http-status');

const { Op } = Sequelize;

function Timestamp(from, to) {
  const check = date => !Number.isNaN(date.getTime());

  if (check(from) && check(to)) return { [Op.between]: [from, to] };
  if (check(from)) return { [Op.gte]: from };
  if (check(to)) return { [Op.lte]: to };
  return { [Op.not]: null };
}

function getFromDate(step, count) {
  const date = new Date();
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  if (step === 'day') from.setDate(date.getDate() - count + 1);
  else if (step === 'week') from.setDate(date.getDate() - 7 * count + 1);
  else if (step === 'month') from.setMonth(date.getMonth() - count + 1);
  else if (step === 'year') from.setYear(date.getYear() - count + 1);
  else return null;
  return from;
}

module.exports = class Chart {
  routes() {
    this.get('/users/all/chart', this.get_chart);
    this.get('/users/:id/chart', this.get_user_chart);
  }

  // get chart data (params: step, count, from, to)
  async get_chart(req, res) {
    const step = req.query.step || 'day'; // day/week/month/year
    const stepsCount = req.query.count || 12;
    const to = req.query.to ? new Date(req.query.to) : new Date();
    const from = req.query.from ? new Date(req.query.from) : getFromDate(step, stepsCount);
    if (!from) return res.sendStatus(HTTPStatus.NOT_FOUND);

    const users = [];
    await this.models.Likes.findAll({
      attributes: ['target', [Sequelize.fn('count', '*'), 'count']],
      where: { timestamp: { [Op.between]: [from, to] } },
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

    const charts = [];
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      const chart = await this.getChart(users[i].id, from, to, step);
      charts.push({ id: user.id, username: user.username, data: chart.data });
    }

    return res.json({
      step, stepsCount, from: from.toJSON(), to: to.toJSON(), charts,
    });
  }

  // get user chart data (params: step, count, from, to)
  async get_user_chart(req, res) {
    const step = req.query.step || 'day'; // day/week/month/year
    const count = req.query.count || 12;
    const to = req.query.to ? new Date(req.query.to) : new Date();
    const from = req.query.from ? new Date(req.query.from) : getFromDate(step, count);
    if (!from) return res.sendStatus(HTTPStatus.NOT_FOUND);

    const target = (req.params.id === 'me')
      ? await this.helper.get_userid(req)
      : Number.parseInt(req.params.id, 10);
    if (!target) return res.sendStatus(HTTPStatus.NOT_FOUND);
    const chart = await this.getChart(target, from, to, step);

    return res.json({
      target, step, count, from: from.toJSON(), to: to.toJSON(), data: chart.data,
    });
  }

  async getChart(target, from, to, step) {
    const nextDate = (prev, max) => {
      if (prev >= max) return null;
      const date = new Date(prev);
      let next = max;
      if (step === 'day') next = date.setDate(date.getDate() + 1);
      if (step === 'week') next = date.setDate(date.getDate() + 7);
      if (step === 'month') next = date.setMonth(date.getMonth() + 1);
      if (step === 'year') next = date.setYear(date.getYear() + 1);
      if (next >= max) return new Date(max);
      return new Date(next);
    };

    const data = await this.models.Likes.findAll({
      where: { target, timestamp: Timestamp(from, to) },
      order: [['timestamp', 'ASC']],
    })
      .then((likes) => {
        let prev = from;
        let next = nextDate(from, to);
        let count = 0;
        const counts = [];

        let i = 0;
        while (next <= to) {
          if (i < likes.length && new Date(likes[i].timestamp) <= next) {
            count += 1;
            i += 1;
          } else {
            counts.push({ count, from: prev.toJSON(), to: next.toJSON() });
            count = 0;
            prev = next;
            next = nextDate(prev, to);
            if (next === null) break;
          }
        }
        // counts.push({ count, from: prev.toJSON(), to: to.toJSON() });
        return counts;
      })
      .catch(err => console.log(err));

    return { target, data };
  }
};
