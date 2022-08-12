const { Model, DataTypes } = require('sequelize');
const config = require('config');
const bcrypt = require('bcrypt');

class User extends Model {
  static initModel(sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        allowNull: false,
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      hooks: {
        beforeCreate: async (user) => {
         if (user.password) {
          user.password = bcrypt.hashSync(user.password, 10);
         }
        },
        beforeUpdate:async (user) => {
         if (user.password) {
          user.password = bcrypt.hashSync(user.password, 10);
         }
        }
       },
      instanceMethods: {
        validPassword: (password) => {
         return bcrypt.compareSync(password, this.password);
        }
       },
    });
    return User;
  }
}

User.prototype.validPassword = async (password, hash) => {
  return await bcrypt.compareSync(password, hash);
};

module.exports = { User };
