const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     name: {
        type: String,
        required:[true, 'name is required'],
        trim: true
     },
     email: {
        type: String,
        required:[true, 'email is required'],
        unique: true
     },
     password: {
        type: String,
        required:[true, 'password is required'],
        unique: true
     },
     phone: {
        type: String,
        required: true,
     },
     address: {
        type: String,
        required: true,
     },
     answer: {
      type: String,
      required: true,
   },
     role: {
        type: Number,
        default: 0
     }
}, {timestamps: true})

const create = mongoose.model('users', userSchema);

module.exports = create;