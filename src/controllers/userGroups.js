'use strict'
const express = require('express')
const _ = require('lodash')
const Joi = require('joi')

const router = express.Router()

const { sendJoiValidationError } = require('../utils/joi')
const { asyncErrorWrapper } = require('../utils')
const { objectIdRegex } = require('../utils/regex')

const { UserModel, UserGroupModel }  = require('../models/index')

const userGroupFieldList = ['code', 'name', 'description', 'ownerId', 'managerIds']
const userGroupBodySchema = Joi.object().keys({
  code: Joi.string().alphanum().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  ownerId: Joi.string().regex(objectIdRegex).required(),
  managerIds: Joi.array().items(
    Joi.string().regex(objectIdRegex)
  ),
})

router.post('/', function(req, res, next) {
    const body = _.pick(req.body, userGroupFieldList)

    const joiResult  = Joi.validate(body, userGroupBodySchema, {
      abortEarly: false,
    })

    const joiError = joiResult.error

    if (!_.isNil(joiError)) {
      return sendJoiValidationError(joiError, res)
    } else {
      return next()
    }
  },
  asyncErrorWrapper(async function(req, res) {
    const body = _.pick(req.body, userGroupFieldList)
    let userGroup = await UserGroupModel.findOneWithPopulate({
      code: body.code,
    })

    if (!_.isNil(userGroup)) {
      return res.status(403).send('UserGroup code exist')
    }

    userGroup = await UserGroupModel.createUserGroup(body)

    res.status(200).json(userGroup)
  })
)

module.exports = router