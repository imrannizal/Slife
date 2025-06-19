const { Note } = require('../models/note');

// Get all notes for a user
exports.getUserNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({ 
      where: { owner: req.user.id },
      order: [['created_at', 'DESC']] // Newest first
    });
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Create a note
exports.createNote = async (req, res) => {
  try {
    const { title, content, color, starred } = req.body;
    const note = await Note.create({
      title,
      content: content || null,
      color: color || 'white',
      starred: starred || false,
      owner: req.user.id
    });
    res.status(201).json(note);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(400).json({ 
      error: 'Failed to create note',
      details: err.errors?.map(e => e.message) // Sequelize validation errors
    });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const [updated] = await Note.update(req.body, {
      where: { 
        id: req.params.id,
        owner: req.user.id 
      }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Note not found or not owned by user' });
    }

    const updatedNote = await Note.findOne({
      where: { id: req.params.id }
    });
    
    res.json(updatedNote);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(400).json({ 
      error: 'Failed to update note',
      details: err.errors?.map(e => e.message)
    });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const deleted = await Note.destroy({
      where: { 
        id: req.params.id,
        owner: req.user.id 
      }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Note not found or not owned by user' });
    }

    res.status(204).end(); // 204 No Content for successful deletes
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};