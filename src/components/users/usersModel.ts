import mongoose from 'mongoose';
import { iUser } from '../../interfaces/iUser';
const Schema = mongoose.Schema;
import crypto from 'crypto';
import { NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';

// @ts-ignore
const UserSchema = new Schema({
  name: {
    type: String,
    min: 2
  },
  company: {
    type: String,
    max: 50,
    min: 2
  },
  position: {
    type: String,
    max: 50,
    min: 2
  },
  phone: {
    type: String,
    max: 25,
    min: 6
  },
  email: {
    type: String,
    max: 255,
    min: 6,
    unique: true
  },
  authMethod: {
    type: String,
    enum: ['facebook', 'emailAndPassword']
  },
  facebook: {
    profile_id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  password: {
    type: String,
    max: 255,
    min: 3,
    required: [true, 'Please provide a password'],
    // select: false //not to show in the output to client when using get(read) query
  },
  passwordConfirm: {
    type: String,
    max: 255,
    min: 3,
    // select: false,
    required: [true, 'Please confirm your password']
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

// hash password if it was modified
UserSchema.pre('save', async function(next: NextFunction) {
  if (!this.isModified('password')) return next();
  // @ts-ignore
  this.password = await bcryptjs.hash(this.password, 8);
  // @ts-ignore
  this.passwordConfirm = undefined;
});

//compare passwords
UserSchema.methods.correctPassword = async function(
  candidatePassword: string,
  userPassword: string
) {
  console.log(candidatePassword)
  console.log(userPassword)
 return console.log(await bcrypt.compare(
    candidatePassword,
    userPassword
  ));

};

//createPasswordResetToken for forgot password route
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model<iUser>(
  'User',
  UserSchema
);
