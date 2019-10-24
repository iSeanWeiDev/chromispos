'use strict';
module.exports = (sequelize, DataTypes) => {
  const db = sequelize.define('db', {
    hostName: DataTypes.STRING,
    host: DataTypes.STRING,
    port: DataTypes.NUMBER,
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    dbName: DataTypes.STRING
  }, {});
  db.associate = function(models) {
    // associations can be defined here
  };
  return db;
};