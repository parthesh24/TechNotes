const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')
const verifyJwt = require('../middleware/verifyJwt')

router.use(verifyJwt)

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

router.route('/:id').get(notesController.getOneNote)

module.exports = router