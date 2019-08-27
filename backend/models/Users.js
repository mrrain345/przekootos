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
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    usertype: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "'NORMAL'",
    },
  }, { sequelize, modelName: 'users' });

  return Users;
};
