const mongoose = require('mongoose');

// passport local mongoose
const plm = require("passport-local-mongoose");



mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    // ye posts k model se connect ho gya reference k through
    ref: 'Post'
  }],

  
  dp: {
    type: String, // You can adjust the type based on where you store the display picture (e.g., URL, file path, etc.).
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
});


userSchema.plugin(plm);

// Create the user model
// User naam se model export aur ye ab as a ref use kr skte h
module.exports = mongoose.model('User', userSchema);


