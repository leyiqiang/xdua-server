'use strict';
// todo check email format
// todo prevent email changing
const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const { UserSchemaString } = require('./user')
const ProfileSchemaString = 'Profile';


const ProfileSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: UserSchemaString,
    index: true,
    required: true,
  },
});

ProfileSchema.statics = {
  createProfileByUserId: async function({ userId, email, phone, gender, description, fullName }) {
    return this({
      email,
      phone,
      gender,
      description,
      fullName,
      userId,
    }).save()
  },
  updateProfileByUserId: async function({ userId, gender, description, fullName }) {
    return this.findByIdAndUpdate({
      userId,
    }, {
      gender,
      description,
      fullName,
    }, {
      new: true,
      runValidators: true,
    })
  },
  deleteProfileByUserId: async function({ userId }) {
    return this.findOneAndDelete({
      userId,
    })
  },
}

ProfileSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true },
});

mongoose.model(ProfileSchemaString, ProfileSchema);

module.exports = {
  ProfileSchemaString,
};
