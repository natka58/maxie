import mongoose from 'mongoose';
import bcrypt  from 'bcrypt';


// const mongoose = require('mongoose');

// const { Schema } = mongoose;
// const bcrypt = require('bcrypt');
// const Order = require('./Order');

const userSchema = new mongoose.Schema({
    name: 
    { 
        type: String, 
        required: true
    },
    email: 
    {
        type: String,
        required: true,
        unique:true,
        index:true,
        dropDups: true,
        sparse:true,
        match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: 
    {
        type: String,
        required: true,
        minlength: 5
    },
    isAdmin: 
    { 
      type: Boolean, 
      required: true, 
      default: false 
    },
});

// hash user password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  
    next();
  });

  // custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

const userModel = mongoose.model('User', userSchema);

export default userModel;
