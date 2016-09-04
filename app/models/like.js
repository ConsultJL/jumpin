module.exports = function (sequelize, DataTypes) {

  var Like = sequelize.define('Like', {
  }, {
    classMethods: {
      associate: function (models) {
      }
    }
  });

  return Like;
};
