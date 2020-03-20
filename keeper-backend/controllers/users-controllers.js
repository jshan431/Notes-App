/**
 * File of users middleware function
 */
const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

let DUMMY_USERS = [
  {
    name: 'State Guy',
    email: 'email@email.com',
    password: '1111111'
  },
  {
    name: 'Fun Guy',
    email: 'email2@email.com',
    password: '1111111'
  }
]

const signup = (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { name, email, password } = req.body;
  
  const existingUser = DUMMY_USERS.find(user => user.email === email);
  if(existingUser){
    throw new HttpError('Failed to sign up. User already exist', 404);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password
  }

  DUMMY_USERS.push(createdUser);
  res.status(201).json({user: createdUser});
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find(user => user.email === email);
  if(!identifiedUser || identifiedUser.password !== password){
    throw new HttpError('Cannot validate credentials', 401);
  }
  res.json({message: 'Logged in!'});
};

exports.signup = signup;
exports.login = login;