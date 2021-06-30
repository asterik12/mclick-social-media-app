const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:"default.jpg",
  },
  cover: {
    type: String,
    default:"cover.jpg",
  },
  work: {
    type: String,
  },
  gender:{
    type: String,
  },
  dob:{
    type: String,
  },
  current_city:{
    type: String,
  },
  hometown:{
    type: String,
  },
  hobbies:{
    type:String,
  },
  school:{
    type: String,
  },
  degree:{
    type: String,
  },
  branch:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', UserSchema)