const config = require("config");
const winston = require("winston");
require("winston-mongodb");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, json, colorize } =
  format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    // colorize(),
    label({ label: "Lug'atim" }),
    timestamp(),
    myFormat,
    json()
  ),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combine.log", level: "info" }),
    new transports.MongoDB({
      db: config.get("dbUri"),
    }),
  ],
});

logger.exitOnError = false;
logger.exceptions.handle(
  new transports.File({ filename: "log/exeptions.log" })
);
logger.rejections.handle(
  new transports.File({ filename: "log/rejections.log" })
);

module.exports = logger;
