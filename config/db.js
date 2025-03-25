const { Pool } = require("pg");

const config = require("config");

const pool = new Pool({
  host: config.get("db_host"),
  user: config.get("db_username"),
  password: config.get("db_password"),
  port: config.get("db_port"),
  database: config.get("db_name"),
});

module.exports = pool
