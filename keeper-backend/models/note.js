const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }  
});

// model will return a constructor with two arguments
module.exports = mongoose.model('Note', noteSchema);