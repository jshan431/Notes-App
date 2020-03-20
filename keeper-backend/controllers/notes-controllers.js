//File of middleware functions
const { validationResult } = require('express-validator');
const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const Note = require('../models/note');
const User = require('../models/user');
const mongoose = require('mongoose');

const getNoteById = async (req, res, next) => {
  const noteId = req.params.nid;
  
  // Search DB
  let note;
  try{
    //get back a mongoose object
    note = await Note.findById(noteId);
  } catch(err){
    //error will be caught if get request has problem
    const error = new HttpError(
      'Something went wrong, could not find note.', 500
    );
    return next(error);
  }

  // if the provided noteId is not found in our db return error
  if(!note){
    const error = new HttpError(
      'Cannot find note from note id',
      404
    );
    return next(error);
  }

  //turn our given mongoose object back to a JS object.
  res.json({note: note.toObject( {getters: true} )});
};

const getNotesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  //Search DB
  let notes;
  try{
    // Have to specify the key and value of thing to find which find returns an array
    notes = await Note.find({ creator : userId});
  } catch(err){
    //error will be caught if get request has problem
    const error = new HttpError(
      'Fetching junks failed, please try again later',
      500
    );
    return next(error);
  }

  if(!notes || notes.length === 0){
    const error = new HttpError(
      'Cannot find notes from users id',
      404
    );
    return next(error);
  }

  // since notes is a mongoose array we use map on each element and make it into an object
  res.json({notes: notes.map(note => note.toObject({ getters: true}))});
}

const createNote = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  //Extract data from incoming requests
  const { title, description, creator } = req.body;
  
  //Create Note object based on info from req body
  const createdNote = new Note({
    title, 
    description,
    creator
  });

  // Check if user exist in DB
  let user;
  try{
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again',
      500
    );
    return next(error);
  }

  if(!user){
    const error = new HttpError(
      'Could not find user for provided id',
      500
    );
    return next(error);
  }

  console.log(user);

  //store created Note document to db, assign user note array with created Note
  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    //save created place to db
    await createdNote.save({ session: sess});
    //add note to user
    user.notes.push(createdNote);
    await user.save({ session: sess});
    await sess.commitTransaction();
  }catch(err){
    const error = new HttpError(
      'Creating note failed, please try again.',
      500
    );
    // stop code execution if we have an error
    return next(error);   
  }

  res.status(201).json({note: createdNote});
};

const updateNote = async (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description} = req.body;
  const noteId = req.params.nid;

  //Search DB
  let note;
  try {
    note = await Note.findById(noteId);
  } catch (err){
    const error = new HttpError(
      'Something went wrong, couldnt not update place.', 500
    );
    return next(error);
  }

  //make changes for the found note in the DB
  note.title = title;
  note.description = description;

  //store updated note 
  try{
    await note.save();
  } catch (err){
    const error = new HttpError(
      'Something went wrong. Could not update place.', 500
    );
    return next(error);
  }

  //turn our given mongoose object back to a JS object.
  res.status(200).json({note: note.toObject({getters: true})});
}

const deleteNote = async (req, res, next) => {
  const noteId = req.params.nid;

  //Search DB
  let note;
  try{
    note = await Note.findById(noteId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  if(!note){
    const error = new HttpError(
      'Could not find note for this id',
      404
    );
    return next(error);
  }

  // Try removing note from notes collection and remove the note from creator's notes array
  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await note.remove({session: sess});
    note.creator.notes.pull(note);      // we are able to do this because of populate
    await note.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  res.status(200).json({note: note.toObject({getters : true})})
}

//export pointers to the functions
exports.getNoteById = getNoteById;
exports.getNotesByUserId = getNotesByUserId;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;