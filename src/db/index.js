const Sequelize = require('sequelize');
const config = require('config');
const { SequelizeStorage, Umzug } = require('umzug');
const Models = require('./models');

let db;
// if (config.has('db.connectionString')) {
  db = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'hr',
    username: 'root',
    password: '',
    dialectOptions: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        supportBigNumbers: true,
        bigNumberStrings: true
    },
  });
// } else {
//   db = new Sequelize({ ...config.get('db') });
// }

const umzug = new Umzug({
  migrations: { glob: 'src/db/migrations/*.js' },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),
  logger: console,
});
module.exports.initializeDb = async () => {
  await umzug.up();
  Models.initModels(db);
  return Models;
};
