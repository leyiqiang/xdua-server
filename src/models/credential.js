'use strict'
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const _ = require('lodash')
const hmacSHA512 = require('crypto-js/hmac-sha512')

const Schema = mongoose.Schema

const { UserSchemaString } = require('./user')
const CredentialSchemaString = 'Credential'


const CredentialSchema = new Schema({
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: UserSchemaString,
    index: true,
    required: true,
  },
})

CredentialSchema.statics = {
  authenticate: async function ({ userId, plainTextPassword }) {
    const user = await this.findOne({
      userId,
    })
    return this.encryptPassword(plainTextPassword, user.hashedPassword) === user.hashedPassword
  },
  createCredentials: async function ({ userId, plainTextPassword }) {
    const salt = this.makeSalt()
    const hashedPassword = this.encryptPassword(plainTextPassword, salt)
    return this({
      userId,
      salt,
      hashedPassword,
    }).save()
  },
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())).toString()
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {String} salt
   * @return {String}
   * @api public
   */
  encryptPassword: function (password, salt) {
    if (_.isNil(password))
      throw new Error('password is empty')
    return hmacSHA512(password, salt).toString()
  },
}

CredentialSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true },
})

mongoose.model(CredentialSchemaString, CredentialSchema)


module.exports = {
  CredentialSchemaString,
}
