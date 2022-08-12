const { User } = require('./User');

module.exports = {
  User,
};
module.exports.initModels = async (sequelize) => {
  User.initModel(sequelize);
};
