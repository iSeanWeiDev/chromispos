'use strict';
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    name: DataTypes.STRING,
    detail: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isUser: DataTypes.BOOLEAN,
  }, {});
  Report.associate = function(models) {
    // associations can be defined here
  };
  return Report;
};