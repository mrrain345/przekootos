const cryptoRandom = require('crypto-random-string');
const nodemailer = require('nodemailer');
const authenticator = require('otplib/authenticator');
const crypto = require('crypto');

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
      attributes: { exclude: ['password', 'auth_2fa'] },
      where: { id: sess.user },
    }).catch(err => console.log(err));
    if (!user) return null;

    return user.dataValues;
  },

  create_session: async (res, id, token) => {
    const user = await models.Users.findByPk(id, {
      attributes: { exclude: ['password'] },
    }).catch(err => console.log(err));

    if (!user) return null;
    if (user.registration_code) {
      return { error: { code: 1, message: 'User is not verified' } };
    }
    if (user.auth_2fa) {
      if (!token) {
        return { error: { code: 2, message: '2fa token is undefined' } };
      }
      authenticator.options = { crypto };
      if (!authenticator.check(token, user.auth_2fa)) {
        return { error: { code: 3, message: '2fa token is incorrect' } };
      }
    }

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
