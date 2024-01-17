const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  }
  // Add other profile fields as needed
});

module.exports = mongoose.model('Profile', ProfileSchema);
