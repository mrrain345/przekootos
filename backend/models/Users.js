const Sequelize = require('sequelize');

module.exports.init = (sequelize) => {
  class Users extends Sequelize.Model {}
  Users.init({
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING(80),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    registration_code: {
      type: Sequelize.STRING(32),
      allowNull: true,
    },
    auth_2fa: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  }, { sequelize, modelName: 'users' });

  return Users;
};
