const cryptoRandom = require('crypto-random-string');
const nodemailer = require('nodemailer');

module.exports = (cookies, sequelize, config, models) => ({
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

    return user.dataValues;
  },

  create_session: async (res, id) => {
    const user = await models.Users.findByPk(id, {
      attributes: { exclude: ['password'] },
    }).catch(err => console.log(err));

    if (!user) return null;
    if (user.registration_code) return false;

    const session = `normal:${cryptoRandom({ length: 32 })}`;

    await models.Sessions.create({
      user: user.id,
      session,
    }).catch(err => console.log(err));

    res.cookie('session', session, {
      maxAge: config.sessionTime,
      httpOnly: true,
      signed: true,
    });

    return user;
  },
  refresh_session: async (req, res) => {
    const { session } = req.signedCookies;
    await models.Sessions.update(
      { session },
      { where: { session } },
    ).catch(err => console.log(err));

    res.cookie('session', session, {
      maxAge: config.sessionTime,
      httpOnly: true,
      signed: true,
    });
  },
  send_email: (address, subject, content) => {
    const transporter = nodemailer.createTransport(config.nodemailer);
    const mail = {
      from: config.mail_address,
      to: address,
      subject,
      html: content,
    };

    transporter.sendMail(mail, (err) => {
      if (err) console.log(err);
    });
  },
});
