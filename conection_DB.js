require("dotenv").config();
const Sequelize = require("sequelize");
const { DB_PASSWORD, DB_USER, DB_HOST, DB_PORT, BDD } = process.env;

const database = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${BDD}`,
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    native: false,
  }
);

module.exports = database;
