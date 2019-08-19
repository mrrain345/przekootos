const cryptoRandom = require('crypto-random-string');
const fetch = require('node-fetch');

async function get_github_data(session) {
  if (session.split(':')[0] !== 'github') return null;
  const token = session.split(':')[1];

  const user = await fetch(`https://api.github.com/user?access_token=${token}`, {
    headers: { Accept: 'application/json' },
  })
    .then(res => res.json())
    .catch(err => console.log(err));

  const emails = await fetch(`https://api.github.com/user/emails?access_token=${token}`, {
    headers: { Accept: 'application/json' },
  })
    .then(res => res.json())
    .catch(err => console.log(err));

  const email = (emails.length === 1) ? emails[0].email : emails.find(e => e.primary).email;
  return { username: user.name, email };
}

module.exports = (cookies, sequelize, models) => ({
  cookies,
  get_session: (req) => {
    const { session } = req.signedCookies;
    if (!session) return null;
    return session;
  },

  get_userid: async (req) => {
    const { session } = req.signedCookies;
    if (!session) return null;

    const sess = await models.Sessions.findOne({
      where: { session },
    }).catch(err => console.log(err));

    if (!sess) return null;
    return sess.user;
  },

  get_user: async (req) => {
    const { session } = req.signedCookies;
    if (!session) return null;

    const sess = await models.Sessions.findOne({
      where: { session },
    }).catch(err => console.log(err));
    if (!sess) return null;

    const user = await models.Users.findOne({
      attributes: { exclude: ['password'] },
      where: { id: sess.user },
    }).catch(err => console.log(err));
    if (!user) return null;

    return { id: user.id, userdata: user };
  },

  create_session: async (res, id) => {
    const user = await models.Users.findByPk(id, {
      attributes: { exclude: ['password'] },
    }).catch(err => console.log(err));

    if (!user) return null;
    const session = `normal:${cryptoRandom({ length: 32 })}`;

    await models.Sessions.create({
      user: user.id,
      session,
    }).catch(err => console.log(err));

    res.cookie('session', session, {
      maxAge: 1000 * 60 * 60 * 30, // session for 30 days
      httpOnly: true,
      signed: true,
    });

    return {
      id: user.id,
      userdata: user,
    };
  },

  async create_github_session(res, id, token) {
    await models.Sessions.create({
      user: id,
      session: `github:${token}`,
    }).catch(err => console.log(err));

    res.cookie('session', `github:${token}`, {
      maxAge: 1000 * 60 * 60 * 30, // session for 30 days
      httpOnly: true,
      signed: true,
    });
  },
  get_github_data,
});
