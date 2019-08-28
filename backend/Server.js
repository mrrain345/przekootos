const express = require('express');
const cookies = require('cookie-parser');
const Sequelize = require('sequelize');
const schedule = require('node-schedule');
const helper = require('./helper');

const { Op } = Sequelize;

module.exports = class Server {
  constructor(data) {
    this.controllers = data.controllers;
    this.config = data.config;

    this.express = express();
    this.express.use(express.json());
    this.express.use(cookies(this.config.cookieSecret));

    this.sequelize = new Sequelize(
      this.config.db.database,
      this.config.db.user,
      this.config.db.password,
      {
        host: this.config.db.host,
        dialect: this.config.db.engine,
        port: this.config.db.port,
        logging: this.config.db.logging,
      },
    );

    // initialize models
    this.models = {};
    Object.keys(data.models).forEach((model) => {
      this.models[model] = data.models[model].init(this.sequelize);
    });

    this.helper = helper(cookies, this.sequelize, this.config, this.models);

    // set controllers default fields
    for (let i = 0; i < this.controllers.length; i += 1) {
      const controller = this.controllers[i];
      const router = express.Router();
      controller.router = router;
      controller.helper = this.helper;
      controller.sequelize = this.sequelize;
      controller.models = this.models;
      controller.config = this.config;

      controller.get = (path, method) => {
        router.get(path, method.bind(controller));
      };

      controller.post = (path, method) => {
        router.post(path, method.bind(controller));
      };

      controller.put = (path, method) => {
        router.put(path, method.bind(controller));
      };

      controller.patch = (path, method) => {
        router.patch(path, method.bind(controller));
      };

      controller.delete = (path, method) => {
        router.delete(path, method.bind(controller));
      };
    }

    // initialize controllers
    this.controllers.forEach((controller) => {
      if (controller.init) controller.init();
    });

    // set controllers routes
    this.controllers.forEach((controller) => {
      controller.routes();
      this.express.use('/api', controller.router);
    });
  }

  async run() {
    // check database connection
    await this.sequelize.authenticate();

    // run express server
    this.express.listen(this.config.port, () => {
      console.log(`Listening on ${this.config.port}`);
    });

    // remove old sessions every day at 3am
    schedule.scheduleJob({ hour: 3, minute: 0 }, () => {
      const timestamp = new Date(new Date() - this.config.sessionTime);
      this.models.Sessions.destroy({
        where: {
          updatedAt: { [Op.lt]: timestamp },
        },
      });
    });
  }
};
