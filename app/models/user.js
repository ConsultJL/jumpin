var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    profilePic: DataTypes.STRING,
    coverPhoto: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Like);
        User.hasMany(models.Post);
        User.belongsTo(models.Team);
      }
    }
  });

  return User;
};
