const fetch = require('node-fetch');
const HTTPStatus = require('http-status');

module.exports = class GitHub {
  routes() {
    this.get('/login/github', this.github);
  }

  async github(req, res) {
    const session = req.query.code;

    const data = {
      client_id: this.config.github.client_id,
      client_secret: this.config.github.secret,
      code: session,
    };

    const result = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(_res => _res.json())
      .catch(err => console.log(err));

    if (result.error) return res.json(result);

    const { access_token } = result;
    const scopes = result.scope.split(',');
    const hasEmail = scopes.includes('user:email');
    const hasUser = scopes.includes('read:user');

    if (!hasEmail && !hasUser) return res.sendStatus(HTTPStatus.NOT_FOUND);
    const user = await this.get_userdata(access_token);

    const usr = await this.models.Users.findOne({
      attributes: { exclude: ['password'] },
      where: { email: user.email, usertype: 'GITHUB' },
    })
      .then(async (_usr) => {
        if (!_usr) {
          return this.models.Users.create({
            username: user.username,
            password: null,
            email: user.email,
            usertype: 'GITHUB',
          }, {
            returning: ['id'],
          })
            .then(us => us[1][0].dataValues);
        }

        return this.models.Users.update({
          username: user.username,
          password: null,
          email: user.email,
          usertype: 'GITHUB',
        }, {
          where: {
            email: user.email,
            usertype: 'GITHUB',
          },
          returning: true,
        })
          .then(us => us[1][0].dataValues);
      })
      .catch(err => console.log(err));

    await this.helper.create_github_session(res, usr.id, access_token);
    return res.json(user);
  }

  async get_userdata(token) {
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

    const email = (emails.length === 1)
      ? emails[0].email
      : emails.find(e => e.primary).email;

    return { username: user.name, email };
  }
};