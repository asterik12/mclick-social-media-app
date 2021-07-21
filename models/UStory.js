const mongoose = require('mongoose')

const UStorySchema = new mongoose.Schema({

  storiesimage: {
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
  


  likes:{
    type:Array,
    default:[],
  }
})
module.exports = mongoose.model('UStory', UStorySchema)