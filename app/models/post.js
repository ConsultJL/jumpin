module.exports = function (sequelize, DataTypes) {

  var Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    desc: DataTypes.TEXT,
    picture_url: DataTypes.STRING,
    video_url: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Post.belongsTo(models.User);
        Post.hasMany(models.Like);
      }
    }
  });

  return Post;
};
