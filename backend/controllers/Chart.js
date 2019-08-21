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

module.exports = class Chart {
  routes() {
    this.get('/users/:id/chart', this.get_chart);
  }

  // get chart data (params: step, count, from, to)
  async get_chart(req, res) {
    const step = req.query.step || 'day';  // day/week/month/year
    const count =  req.query.count || 12;

    const to = req.query.to ? new Date(req.query.to) : new Date();
    let from = req.query.from? new Date(req.query.from) : new Date();

    if (!req.query.from) {
      const date = new Date();
      from.setHours(0, 0, 0, 0);
      if (step === 'day') from.setDate(date.getDate() - count);
      else if (step === 'week') from.setDate(date.getDate() - 7 * count);
      else if (step === 'month') from.setMonth(date.getMonth() - count);
      else if (step === 'year') from.setYear(date.getYear() - count);
      else return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    const target = (req.params.id === 'me') ? await this.helper.get_userid(req) : Number.parseInt(req.params.id);
    if (!target) return res.sendStatus(HTTPStatus.NOT_FOUND);

    const nextDate = (prev, max) => {
      if (prev === max) return null;
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
    .then(likes => {
      let prev = from;
      let next = nextDate(from, to);
      let count = 0;
      let counts = [];

      let i = 0;
      while (next <= to && i < likes.length) {
        if (new Date(likes[i].timestamp) <= next) {
          count += 1;
          i += 1;
        }
        else {
          counts.push({ count, from: prev.toJSON(), to: next.toJSON() });
          count = 0;
          prev = next;
          next = nextDate(prev, to);
          if (next === null) break;
        }
      }
      counts.push({ count, from: prev.toJSON(), to: next.toJSON() });
      return counts;
    })
    .catch(err => console.log(err));

    return res.json({target, step, count, from: from.toJSON(), to: to.toJSON(), data});
  }
}