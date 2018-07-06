'use strict'

/**
 * Expose
 */

module.exports = {
  secret: process.env.SESSION_SECRET,
  mongodbURL: process.env.MONGO_DB_URI,
}