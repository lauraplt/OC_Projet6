const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //unique:true so you can subscribe once time with the same email address
  password: { type: String, required: true }
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);