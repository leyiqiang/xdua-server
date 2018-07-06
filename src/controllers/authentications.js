'use strict';
const express = require('express');
const _ = require('lodash');
const Joi = require('joi');

const router = express.Router();

// const { like, unlike, findMoviesLikedByUserId, findUsersLikeMovieId } = require('../module/likes');
// const { JoiLikeSchema } = require('../models/like');
const { sendJoiValidationError } = require('../utils/joi');
const { asyncErrorWrapper } = require('../utils')

const usersModule = require('../modules/users')

const { UserModel, CredentialModel, ProfileModel }  = require('../models/index');

const loginFieldList = ['email', 'password'];
router.post('/login', function(req, res, next) {
    const loginBody = _.pick(req.body, loginFieldList);

    const loginBodySchema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    })

    const joiResult  = Joi.validate(loginBody, loginBodySchema, {
      abortEarly: false,
    });

    const joiError = joiResult.error;

    if (!_.isNil(joiError)) {
      return sendJoiValidationError(joiError, res);
    } else {
      return next()
    }
  }, asyncErrorWrapper(async function(req, res) {
    const { email, password } = _.pick(req.body, loginFieldList);
    const profile = await ProfileModel.findOne({
      email,
    })

    if (_.isNil(profile)) {
      res.status(404).send(`User: ${email} not found`)
    }

    const { userId } = profile

    const passwordIsValid = CredentialModel.authenticate({
      userId,
      plainTextPassword: password,
    })
    if (passwordIsValid === false) {
      return res.status(401).send({ auth: false, token: null });
    }
    const token = usersModule.generateJwtTokenForUser({ userId });
    res.status(200).send({ auth: true, token: token });
  })
);


const registerFieldList = ['password', 'email', 'phone', 'gender', 'description', 'fullName'];
router.post('/register', function(req, res, next) {
    const body = _.pick(req.body, registerFieldList);

    const registerBodySchema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      // todo: phone number format validation
      phone: Joi.string().required(),
      gender: Joi.any().valid(['MALE', 'FEMALE']),
      description: Joi.string(),
      fullName: Joi.string().required(),
    })

    const joiResult  = Joi.validate(body, registerBodySchema, {
      abortEarly: false,
    });

    const joiError = joiResult.error;

    if (!_.isNil(joiError)) {
      return sendJoiValidationError(joiError, res);
    } else {
      return next()
    }
  }, asyncErrorWrapper(async function(req, res) {
    const {
      email,
      password,
      phone,
      gender,
      description,
      fullName,
    } = _.pick(req.body, registerFieldList);

    // validate email and phone unique
    const profile = await ProfileModel.findOne({
      $or: [
        {
          email,
        },
        {
          phone,
        },
      ],
    })

    if (!_.isNil(profile)) {
      return res.status(404).send(`Email: ${email} or Phone: ${phone} already exists`)
    }

    const user = await UserModel.create({
      active: true,
    })

    const userId = user._id

    await CredentialModel.createCredentials({
      userId,
      plainTextPassword: password,
    })

    await ProfileModel.createProfileByUserId({
      userId,
      phone,
      email,
      gender,
      description,
      fullName,
    })

    const token = usersModule.generateJwtTokenForUser({ userId });
    res.status(200).send({ auth: true, token: token });
  })
);

module.exports = router;