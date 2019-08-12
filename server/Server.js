const express = require('express');
const cookies = require('cookie-parser');
const { Client } = require('pg');
const helper = require('./helper');

module.exports = class Server {
  constructor(controllers, config) {
    this.controllers = controllers;
    this.config = config;

    this.express = express();
    this.express.use(express.json());
    this.express.use(cookies(this.config.cookieSecret));

    this.db = new Client(this.config.postgres);
    this.db.connect();

    this.helper = helper(this.db, cookies);

    // set controllers default fields
    for (let i = 0; i < this.controllers.length; i += 1) {
      const controller = this.controllers[i];
      const router = express.Router();
      controller.router = router;
      controller.db = this.db;
      controller.helper = this.helper;

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
