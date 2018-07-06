'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config');


/**
 * private helper method for verifying token
 * @param token
 * @returns {Promise}
 */
async function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        reject(err);
      }

      resolve(decoded);
    });
  });
}


function generateJwtTokenForUser({ userId }) {
  return jwt.sign({ userId }, config.secret, {
    expiresIn: 60 * 60 * 24 * 7, // expires in a week
  });
}

async function verifyMe({ userId }, token) {
  try {
    const decodedToken = await decodeToken(token);
    if (userId === decodedToken.userId) {
      return {
        auth: true,
      };
    } else {
      return {
        auth: false,
        message: 'User Id does not match the token User Id',
      }
    }
  } catch(error) {
    return {
      auth: false,
      message: error,
    }
  }
}

module.exports = {
  generateJwtTokenForUser,
  verifyMe,
  decodeToken,
};
