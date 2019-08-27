/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports.init = (sequelize) => {
  const Users = require('./Users').init(sequelize);

  class Sessions extends Sequelize.Model {}
  Sessions.init({
    session: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    user: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: Users, key: 'id' },
    },
  }, { sequelize, timestamps: true, modelName: 'sessions' });

  return Sessions;
};
