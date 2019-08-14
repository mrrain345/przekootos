/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports.init = (sequelize) => {
  const Users = require('./Users').init(sequelize);

  class Likes extends Sequelize.Model {}
  Likes.init({
    id: {
      type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
    },
    user: { type: Sequelize.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    target: { type: Sequelize.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  }, { sequelize, modelName: 'likes', timestamps: false });

  return Likes;
};
