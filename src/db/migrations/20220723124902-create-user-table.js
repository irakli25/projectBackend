const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('Users', {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: true,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(120),
    },
    lastName: {
      type: DataTypes.STRING(120),
    },
    password: {
      type: DataTypes.STRING(120),
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
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Users');
}

module.exports = { up, down };
