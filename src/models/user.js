'use strict'
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const Schema = mongoose.Schema

const UserSchemaString = 'User'
// const { ProfileSchemaString } = require('./profile')
//
// const ProfileModel = mongoose.model(ProfileSchemaString);

const UserSchema = new Schema({
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  superAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
})

UserSchema.statics = {
  createUser: async function() {
    return new this({
      active: true,
      superAdmin: false,
    }).save()
  },
  findUserById: async function({ userId }) {
    return this.findById(userId)
  },
}

UserSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true },
})

mongoose.model(UserSchemaString, UserSchema)

module.exports = {
  UserSchemaString,
}
