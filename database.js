const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_ROOT,
  process.env.DATABASE_PASS,
  {
    dialect: process.env.DATABSE_DIALECT,
    host: process.env.DATABASE_HOST,
  }
);

module.exports = sequelize;
