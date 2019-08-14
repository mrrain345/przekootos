/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports.init = (sequelize) => {
  const Users = require('./Users').init(sequelize);

  class Sessions extends Sequelize.Model {}
  Sessions.init({
    session: {
      type: Sequelize.STRING(32), allowNull: false, autoIncrement: true, primaryKey: true,
    },
    user: { type: Sequelize.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  }, { sequelize, modelName: 'sessions' });

  return Sessions;
};
