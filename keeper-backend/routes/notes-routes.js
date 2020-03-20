const express = require('express');
const { check } = require('express-validator'); 
const notesController = require('../controllers/notes-controllers');

const router = express.Router();


router.get(
  '/:nid', notesController.getNoteById
);

router.get(
  '/user/:uid', notesController.getNotesByUserId
);

// Validator middleware is placed before our createNote middleware
router.post(
  '/', 
  [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
  ],
  notesController.createNote
);

// Validator middleware is placed before our updateNote middleware
router.patch(
  '/:nid', 
  [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
  ],
  notesController.updateNote
);

router.delete(
  '/:nid', notesController.deleteNote
);

module.exports = router;