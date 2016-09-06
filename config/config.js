var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'Jump Institute'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://root:lovemykids@localhost/jumpin-dev'
  },
  production: {
    root: rootPath,
    app: {
      name: 'Jump Institute'
    },
    port: process.env.PORT || 3000,
    // This will be replaced by AWS
    db: 'mysql://jumpindev:Jumpindev11!@aa17gigy3d170ek.cccaubjwjhu0.us-west-2.rds.amazonaws.com/jumpin_prod'
  }
};

module.exports = config[env];
