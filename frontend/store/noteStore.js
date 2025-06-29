import { create } from 'zustand';
import FirebaseNote from '../firebase/FirebaseNote';

const useNoteStore = create((set, get) => ({
    notes: [],
    isLoading: false,
    error: null,

    // Fetch & Cache Notes
    fetchNotes: async (owner) => {
        set({ isLoading: true, error: null });
        try {
            const notes = await FirebaseNote.getUserNotes(owner);
            set({ notes: notes, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    addNote: async (noteData) => {
        set({ isLoading: true });
        try {
            await FirebaseNote.addNote(noteData); // updating firestore
            const notes = await get().fetchNotes(noteData.owner); // updating zustand
            return notes;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Update Note
    updateNote: async (noteId, updates) => {
        set({ isLoading: true });
        try {
            await FirebaseNote.updateNote(noteId, updates); // updating firestore
            set(state => ({
                notes: state.notes.map(note =>
                    note.id === noteId ? { ...note, ...updates } : note // updating zustand
                ),
                isLoading: false
            }));
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Delete Note
    deleteNote: async (noteId) => {
        set({ isLoading: true });
        try {
            await FirebaseNote.deleteNote(noteId); // updating firestore
            set(state => ({
                notes: state.notes.filter(note => note.id !== noteId), // updating zustand
                isLoading: false
            }));
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Account removal case
    deleteAllNotes: async (owner) => {
        set({ isLoading: true });
        try {
            await FirebaseNote.deleteAllUserNotes(owner); // updating firestore
            set({ notes: [], isLoading: false }); // updating zustand
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    toggleNoteStar: async (noteID) => {
        const note = get().notes.find(note => note.id === noteID);
        if (!note) return;

        try {
            set({ isLoading: true});

            // We used optimistic update approach
            set({
                notes: get().notes.map(note =>
                    note.id === noteID ? { ...note, starred: !note.starred } : note
                )
            });

            // Actual firestore update
            await FirebaseNote.updateNote(noteID, {
                starred: !note.starred
            });

            set({ isLoading: false });
        } catch (err) {
            // Reverting errors
            set({
                todos: get().todos,
                isLoading: false,
                error: err.message
            });
            console.log("Error toggling star (noteStore.js): ", err);
            throw err;
        }

    },

    logout: () => {
        set({ notes: [] });
    }

}));

export default useNoteStore;