const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req,res) => {
    const notes = await Note.find().populate('user').lean()
    if(!notes?.length){
        return res.status(400).json({message: 'No notes found'})
    }
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username}
    }))
    res.json(notesWithUser)
})

// @desc Get a note
// @route GET /notes/:id
// @access Private
const getOneNote = asyncHandler(async (req,res) => {
    const id = req.params.id
    console.log(id)
    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({message: "Note not found"})
    }
    res.json(note)
    

})

// @desc create note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req,res) => {
    const {user, title, text} = req.body

    if(!user || !title || !text){
        return res.status(400).json({message: "All fields are required"})
    }

    const userId = new mongoose.Types.ObjectId(user);

    const validUser = await User.findById(userId).exec()
    
    if(!validUser){
        return res.status(400).json({message: "User not found"})
    }

    const duplicate = await Note.findOne({ title }).collection({locale: 'en',strength: 2}).lean().exec()

    if(duplicate){
        return res.status(400).json({ message: 'Duplicate note title'})
    }

    const newNote = {user,title,text}

    const note = await Note.create(newNote)

    
    if(note){
        res.status(201).json({message: `new note created for ${user}`})
    } else {
        res.status(400).json({message: "Invalid data"})
    }
})

// @desc update note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req,res) => {
    const {id, user, title, text, completed} = req.body

    if(!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({message: "all fields are required"})
    }

    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({message: "Note not found"})
    }

    const duplicate = await Note.findOne({title}).collection({locale: 'en', strength: 2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'duplicate note'})
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json({message: `${updatedNote.user}'s ${updatedNote.title} updated`})
})

// @desc delete note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req,res) => {
    const {id} = req.body
    
    if(!id){
        return res.status(400).json({message: "Note id required"})
    }

    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({message: "Note not found"})
    }

    const result = await note.deleteOne()

    const reply = `Note ${note.title} with ID ${note._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    getOneNote,
    createNewNote,
    updateNote,
    deleteNote
}