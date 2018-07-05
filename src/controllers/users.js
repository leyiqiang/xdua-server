'use strict';
const express = require('express');
const _ = require('lodash');
const Joi = require('joi');

const router = express.Router();

// const { like, unlike, findMoviesLikedByUserId, findUsersLikeMovieId } = require('../module/likes');
// const { JoiLikeSchema } = require('../models/like');
// const { sendJoiValidationError } = require('../utils/joi');

const authorization = require('../middlewares/authorization');

router.use(authorization.requiresLogin);

router.get('/', async function (req, res) {
  res.sendStatus(200);
});


module.exports = router;