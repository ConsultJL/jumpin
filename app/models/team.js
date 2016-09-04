module.exports = function (sequelize, DataTypes) {

  var Team = sequelize.define('Team', {
    teamname: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Team.hasMany(models.User);
      }
    }
  });

  return Team;
};
