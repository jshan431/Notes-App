const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-Parser');
const usersRoutes = require('./routes/users-routes');
const notesRoutes = require('./routes/notes-routes');
const HttpError = require('./models/http-error');
const app = express();

//parse the body of incoming request of JSON format and convert it to JS
app.use(bodyParser.json());

//routing middlewares
app.use('/api/notes', notesRoutes);
app.use('/api/users', usersRoutes);

//handle unwanted request 
app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});

//error handling middleware - only executed on req with error thrown
app.use((error, req, res, next) => {
  //check if res was already sent
  if(res.headerSent){
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || 'An unknown error occurred'});
});

//Establish connection with DB and then start up our server
mongoose
  .connect(
    `mongodb+srv://jack123:jack123@cluster0-o5dkr.mongodb.net/notes?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000, () => {
        console.log('Listening on port 5000')
      }
    );
  })
  .catch(err => {
    console.log(err);
  });
