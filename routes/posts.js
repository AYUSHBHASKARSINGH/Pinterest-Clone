const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  image:{
    type: String,
  },
  
  user:{
    type: mongoose.Schema.Types.ObjectId,
    // ye user model ki id h so reference me User jis naame se export hua h model
    ref: 'User'
  },

  currentDateAndTime: {
    type: Date,
    default: Date.now,
  },
  likes: {
    // jo user like krega uski ids store krenge post ke likes array m
    type: Array,
    default: [],
  },
});

// Create the post model
module.exports = mongoose.model('Post', postSchema);


