/**
 * File of users middleware function
 */
const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const signup = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;
  
  //Check if email already exist in the DB
  let existingUser;
  try{
    existingUser = await User.findOne({ email: email})
  } catch(err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  //if email exist in db already throw error
  if(existingUser){
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    notes: []
  });

  // Store created user on DB
  try{
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing Up failed, please try again',
      500
    );
    return next(error);
  }

  res.status(201).json({user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  
  //Check if email already exist in the DB
  let existingUser;
  try{
    existingUser = await User.findOne({ email: email})
  } catch(err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if(!existingUser || existingUser.password !== password){
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({message: 'Logged in!'});
};

exports.signup = signup;
exports.login = login;