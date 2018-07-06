const winston = require('winston');
const path = require('path');

const infoFile = path.join(__dirname, '../../logs/app.log');
const errorFile = path.join(__dirname, '../../logs/errors.log');

const options = {
  file: {
    level: 'info',
    filename: infoFile,
    handleExceptions: true,
    json: true,
    maxsize: '20m', // 20MB
    maxFiles: 5,
    colorize: false,
    timestamp: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
  },
  error: {
    level: 'error',
    filename: errorFile,
    handleExceptions: true,
    json: true,
    maxsize: '20m', // 20MB
    maxFiles: 5,
    colorize: false,
    timestamp: true,
  },
};

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.error),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function(message) {
    logger.info(message);
  },
};
module.exports = logger;
