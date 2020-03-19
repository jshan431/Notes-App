const express = require('express');
const notesController = require('../controllers/notes-controllers');

const router = express.Router();

router.get(
  '/:nid', notesController.getNoteById
);

router.get(
  '/user/:uid', notesController.getNotesByUserId
);

router.post(
  '/', notesController.createNote
);

router.patch(
  '/:nid', notesController.updateNote
);

router.delete(
  '/:nid', notesController.deleteNote
);

module.exports = router;