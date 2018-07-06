const mongoose = require('mongoose')

const { CredentialSchemaString } = require('./credential')
const { ProfileSchemaString } = require('./profile')
const { UserSchemaString } = require('./user')
const { UserGroupSchemaString } = require('./userGroup')

const ProfileModel = mongoose.model(ProfileSchemaString)
const CredentialModel = mongoose.model(CredentialSchemaString)
const UserModel = mongoose.model(UserSchemaString)
const UserGroupModel = mongoose.model(UserGroupSchemaString)

module.exports = {
  CredentialModel,
  CredentialSchemaString,
  ProfileModel,
  ProfileSchemaString,
  UserModel,
  UserSchemaString,
  UserGroupModel,
  UserGroupSchemaString,
}