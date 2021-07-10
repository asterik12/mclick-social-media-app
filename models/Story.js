const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  
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
  }]
})

module.exports = mongoose.model('Story', StorySchema)