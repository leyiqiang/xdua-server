
module.exports = function (app) {
  const logger = require('../loggers')

  const logErrors = function (err, req, res, next) {
    // logger.log({
    //   level: 'error',
    //   message: err.stack,
    // })
    console.error(err)
    logger.log('error', err.stack)
    next(err)
  }

  const errorHandler = function (err, req, res, next) {
    res.sendStatus(500)
    next()
  }

  app.use(logErrors)
  app.use(errorHandler)
}
