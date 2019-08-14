const express = require('express');
const cookies = require('cookie-parser');
const Sequelize = require('sequelize');
const helper = require('./helper');

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
      },
    );

    // initialize models
    this.models = {};
    Object.keys(data.models).forEach((model) => {
      this.models[model] = data.models[model].init(this.sequelize);
    });

    this.helper = helper(cookies, this.sequelize, this.models);

    // set controllers default fields
    for (let i = 0; i < this.controllers.length; i += 1) {
      const controller = this.controllers[i];
      const router = express.Router();
      controller.router = router;
      controller.helper = this.helper;
      controller.sequelize = this.sequelize;
      controller.models = this.models;

      controller.get = (path, method) => {
        router.get(path, method.bind(controller));
      };

      controller.post = (path, method) => {
        router.post(path, method.bind(controller));
      };

      controller.put = (path, method) => {
        router.put(path, method.bind(controller));
      };

      controller.path = (path, method) => {
        router.path(path, method.bind(controller));
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

  run() {
    this.express.listen(this.config.port, () => {
      console.log(`listening on ${this.config.port}`);
    });
  }
};
