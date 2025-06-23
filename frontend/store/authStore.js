import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the store shape and logic
const useAuthStore = create((set, get) => ({

  // Asyncstorage
  // user
  // noteList
  // todoList
  // workspaceList

  user: null,         // user object or null
  notes: [],         // note object or null
  todos: [],        // todo object or null
  isLoggedIn: false,  // boolean indicating auth state

  // Called when user logs in successfully
  login: async ({ user }) => {
    try {
      // Save user to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update Zustand store
      set({ user, isLoggedIn: true });
    } catch (err) {
      console.error('Error saving login data', err);
    }
  },

  // Clear auth state and AsyncStorage
  logout: async () => {
    try {
      await AsyncStorage.removeItem('user');

      set({ user: null, isLoggedIn: false });
    } catch (err) {
      console.error('Error during logout', err);
    }
  },

  // Restore session on app launch
  restoreSession: async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        set({
          user: JSON.parse(storedUser),
          isLoggedIn: true,
        });
      }
    } catch (err) {
      console.error('Error restoring session', err);
    }
  },

  // setting user nots into zustand and asyncstorage
  setUserNotes: async (noteList) => {
    try{

      // zustand
      set({notes: noteList});

      // setup notes in Asyncstorage
      await AsyncStorage.setItem('noteList', JSON.stringify(noteList))

      const test = await AsyncStorage.getItem('noteList');

    } catch {
      console.error('Error catching notes', err)
    }
  },

  loadNotes: async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('noteList');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        set({ notes: parsedNotes });
        return parsedNotes;
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
    return [];
  },

  clearNotes: async () => {
    await AsyncStorage.removeItem('noteList');
    set({ notes: [] });
  }

}));

export default useAuthStore;