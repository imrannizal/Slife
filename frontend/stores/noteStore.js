import { create } from 'zustand';
import * as noteService from '../models/noteService';
import Note from '../models/note';

const useNoteStore = create((set, get) => ({
  notes: [],
  loading: false,
  fetchNotes: async () => {
    set({ loading: true });
    const data = await noteService.getNotes();
    set({ notes: data.map(n => new Note(n)), loading: false });
  },
  addNote: async (noteData) => {
    const newNote = await noteService.createNote(noteData);
    set({ notes: [...get().notes, new Note(newNote)] });
  },
  updateNote: async (id, fields) => {
    const updatedNote = await noteService.updateNote(id, fields);
    set({
      notes: get().notes.map(note =>
        note.id === id ? new Note(updatedNote) : note
      )
    });
  },
  deleteNote: async (id) => {
    await noteService.deleteNote(id);
    set({ notes: get().notes.filter(note => note.id !== id) });
  },
}));
export default useNoteStore;