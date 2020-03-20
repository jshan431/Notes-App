//File of middleware functions
const { validationResult } = require('express-validator');
const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const Note = require('../models/note');

let DUMMY_NOTES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Wall Street',
    description: 'Where the money lives',
    creator: 'u1'
  }
]

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
  }catch(err){
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

  // since junks is a mongoose array we use map on each element and make it into an object
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

  //store create Note document to db
  try{
    await createdNote.save();
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

const updateNote = (req, res, next) => {
  //look at req and check if any validation errors were detected
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description} = req.body;
  const noteId = req.params.nid;

  // Make a copy of the place that will be updated
  const updatedNote = { ...DUMMY_NOTES.find(note => note.id === noteId)};

  // find index of the note to update
  const placeIndex = DUMMY_NOTES.findIndex(note => note.id === noteId);

  //make changes to the copy
  updatedNote.title = title;
  updatedNote.description = description;

  //swap updated note with the old note
  DUMMY_NOTES[placeIndex] = updatedNote;

  res.status(200).json({note: updatedNote});
}

const deleteNote = (req, res, next) => {
  const noteId = req.params.nid;
  const deletedNote = DUMMY_NOTES.find(note => note.id === noteId);
  if(!deletedNote){
    throw new HttpError('Could not find a place for that id', 401);
  }
  DUMMY_NOTES = DUMMY_NOTES.filter(note => note.id !== noteId);
  res.status(200).json({note: deletedNote})
}

//export pointers to the functions
exports.getNoteById = getNoteById;
exports.getNotesByUserId = getNotesByUserId;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;