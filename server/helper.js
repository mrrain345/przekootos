const cryptoRandom = require('crypto-random-string');

module.exports = (cookies, sequelize, models) => ({
  cookies,
  get_session: (req) => {
    const { session } = req.signedCookies;
    if (!session || session.length !== 32) return null;
    return session;
  },

  get_userid: async (req) => {
    const { session } = req.signedCookies;
    if (!session || session.length !== 32) return null;

    const sess = await models.Sessions.findOne({
      where: { session },
    }).catch(err => console.log(err));

    if (!sess) return null;
    return sess.user;
  },

  get_user: async (req) => {
    const { session } = req.signedCookies;
    if (!session || session.length !== 32) return null;

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
    const session = cryptoRandom({ length: 32 });

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
});
