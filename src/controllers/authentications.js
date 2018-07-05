'use strict';
const express = require('express');
const _ = require('lodash');
const Joi = require('joi');

const router = express.Router();

// const { like, unlike, findMoviesLikedByUserId, findUsersLikeMovieId } = require('../module/likes');
// const { JoiLikeSchema } = require('../models/like');
const { sendJoiValidationError } = require('../utils/joi');

const usersModule = require('../modules/users')

router.post('/login', async function(req, res) {

  const fieldList = ['email', 'password'];
  const loginBody = _.pick(req.body, fieldList);

  const joiResult  = Joi.validate(
    loginBody,
    Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    }),
    {
      abortEarly: false,
    });
  const joiError = joiResult.error;

  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send('No user found.');
  }
  const passwordIsValid = user.authenticate(req.body.password);

  if (!passwordIsValid) {
    return res.status(401).send({ auth: false, token: null });
  }
  const token = usersModule.generateJwtTokenForUser(user);
  res.status(200).send({ auth: true, token: token });
});
module.exports = router;