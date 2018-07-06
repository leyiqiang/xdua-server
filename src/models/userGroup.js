'use strict'
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
// const autoPopulate = require('mongoose-autopopulate')

const Schema = mongoose.Schema

const { ProfileSchemaString } = require('./profile')
const { UserSchemaString } = require('./user')
const UserGroupSchemaString = 'UserGroup'


const UserGroupSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: UserSchemaString,
    required: true,
  },
  managerIds: [{
    type: mongoose.Schema.ObjectId,
    ref: UserSchemaString,
  }],
})

UserGroupSchema.virtual('owner', {
  ref: ProfileSchemaString,
  localField: 'ownerId',
  foreignField: 'userId',
  justOne: true,
})

UserGroupSchema.virtual('managers', {
  ref: ProfileSchemaString,
  localField: 'managerIds',
  foreignField: 'userId',
  justOne: true,
})


UserGroupSchema.statics = {
  createUserGroup: async function({ code, name, description, ownerId, managerIds }) {
    return new this({
      code,
      name,
      description,
      ownerId,
      managerIds,
    }).save()
  },
  findWithPopulate: async function(options) {
    const queryResponse = this.find(options)
    return this.populateOwnerAndManagers(queryResponse)
  },
  findOneWithPopulate: async function(options) {
    const queryResponse = this.findOne(options)
    return this.populateOwnerAndManagers(queryResponse)
  },
  populateOwnerAndManagers: async function(queryResponse) {
    const profileSelect = '-email -phone'
    const userGroupList = await queryResponse
      .populate({
        path: 'owner',
        select: profileSelect,
      })
      .populate({
        path: 'managers',
        select: profileSelect,
      })
    return userGroupList
  },
}

UserGroupSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true },
})
// UserGroupSchema.plugin(autoPopulate)

// set virtuals on toObject or toJson.
UserGroupSchema.set('toObject', { virtuals: true })
UserGroupSchema.set('toJson', { virtuals: true })


mongoose.model(UserGroupSchemaString, UserGroupSchema)

module.exports = {
  UserGroupSchemaString,
}
