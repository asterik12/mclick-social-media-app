const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  firstName:{
    type:String
  },
  lastName: {
    type:String
  },
  userImage: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
           
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  share: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  getShared:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  },  
  postUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  isCover: {
    type:String
  },
  isProfile: {
    type: String 
  },
  isLikedUser: {
    type: String,
  },
  isGroupUser: {
    type: String
  },

})

module.exports = mongoose.model('Story', StorySchema)