import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseAuth from '../firebase/FirebaseAuth.js';
import FirebaseUser from '../firebase/FirebaseUser.js';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null, // Object s
      isLoading: false,
      error: null,
      _hasHydrated: false, // For persistence tracking

      // Actions
      // login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await FirebaseAuth.login(email, password); // Getting data from Firebase Auth
          const userData = await FirebaseUser.getProfile(userCredential.user.uid); // Getting data from FireStore via uid from auth
          set({ 
            user: {
              uid: userCredential.user.uid,
              email: userData.email,
              username: userData.username,
              profile_picture: userData.profile_picture,
              created_at: userData.created_at
            },
            isLoading: false
          });
        } catch (err) {
          set({ error: err.message, isLoading: false });
          console.log("Error User data zustand (authStore.js): ", err);
          throw err;
        }
      },

      // logout
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await FirebaseAuth.logout();
          set({
            user : null,
            isLoading: false
          })
        } catch (err) {
          set({ error: err.message, isLoading: false });
          console.log("Error logging out zustand (authStore.js): ", err);
          throw err;
        }
      },

      register: async (email, password, username) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await FirebaseAuth.signUp(email, password); // Getting data from Firebase Auth
          await FirebaseUser.setProfile(userCredential.user.uid, email, username); // creating a user inside firestore 'users' table

          const userData = await FirebaseUser.getProfile(userCredential.user.uid); // Getting data from FireStore via uid from auth
          set({ 
            user: {
              uid: userCredential.user.uid,
              email: userData.email,
              username: userData.username,
              profile_picture: userData.profile_picture,
              created_at: userData.created_at
            },
            isLoading: false
          });

          return true;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          console.log("Error registering User zustand (authStore.js): ", err);
          throw err;
        }
      },

      // This is when you exit the app and then you re-enter it, it auto logins you
      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          const currentUserCredentials = FirebaseAuth.getCurrentUser(); // getting current user
          console.log("user checkAuth (authStore.js): ", currentUserCredentials);

          if (currentUserCredentials == null) { // if there is no current user
            set({ isLoading: false, user: null}) 
            return false;
          }
          
          const currentUserData = await FirebaseUser.getProfile(currentUserCredentials.uid); // if there is one

          if (currentUserData) { // load them up
            set({
              user: {
                uid: currentUserCredentials.uid,
                email: currentUserData.email,
                username: currentUserData.username,
                profile_picture: currentUserData.profile_picture,
                created_at: currentUserData.created_at
              },
              isLoading: false
            });
            return true; // User exists and data is loaded
          }

          set({ user: null, isLoading: false});
          return false; // if there is user in auth, but there is no Firestore data for him/her

        } catch (err) {
          set({ error: err.message, isLoading: false });
          console.log("Error checking auth (authStore.js): ", err);
          throw err;
        }
      },

      updateProfile: async (uid, updates) => {
        await FirebaseUser.updateProfile(uid, updates);
        set({ user: {...get().user, ...updates} });
      },

      // For error clearing
      clearError: () => set({ error: null }),

      // Hydration setter
      setHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export default useAuthStore;