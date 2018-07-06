const mongoose = require('mongoose')

const { CredentialSchemaString } = require('./credential')
const { ProfileSchemaString } = require('./profile')
const { UserSchemaString } = require('./user')

const ProfileModel = mongoose.model(ProfileSchemaString);
const CredentialModel = mongoose.model(CredentialSchemaString);
const UserModel = mongoose.model(UserSchemaString);

module.exports = {
  CredentialSchemaString,
  ProfileSchemaString,
  UserSchemaString,
  ProfileModel,
  CredentialModel,
  UserModel,
}