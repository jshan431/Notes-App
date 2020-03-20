const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // unique true will include an index to speed up process
  password: { type: String, required: true, minlength: 6 },
  notes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Note'}]  //the array says we can reference more than one junks
});

// ensure unique email 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);