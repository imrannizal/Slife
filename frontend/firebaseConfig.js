import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, 
  getDocs, query, where, collection, Timestamp, updateDoc, addDoc  } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';

// Firebase config object
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const db = getFirestore(app);

// Login auth and fetch user data from Firestore
export const loginAndFetchUserData = async (email, password) => {
    try {
      // Sign in with email/password
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user; // This is user object from Firebase Auth

      // Fetch user document from Firestore Documents
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log('User data:', userDocSnap.data());
        return userDocSnap.data();
      } else {    
        console.log('No such user documented!');
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

// Function to login user and fetch additional data from Firestore
export const registerUser = async (email, password, username) => {
  try {
    // Create user with email/password
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Save additional user data to Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      username,
      email: user.email,
      createdAt: serverTimestamp(),
      profile_picture: '', // Placeholder for profile picture
    });

    console.log('User registered successfully:', user);
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Function to get all of one user's notes here
export const getUserNotes = async (username) => {
  try {
    const noteRef = collection(db, 'notes');
    const q = query(
      noteRef,
      where('owner', '==', username)
    );
    const querySnapshot = await getDocs(q);
    const noteList = [];
    
    querySnapshot.forEach((doc) => {
      const { updated_at, created_at, ...rest } = doc.data();
      
      noteList.push({
        id: doc.id, // Include Firestore document ID
        updated_at: new Date(updated_at.seconds * 1000),
        created_at: new Date(created_at.seconds * 1000),
        ...rest
      });
    });

    return noteList;
  } catch (error) {
    console.error('Error fetching user notes:', error);
    throw error;
  }
}

export const updateNote = async (noteId, updatedData) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    
    // Convert Date objects to Firestore timestamps if they exist
    const dataToUpdate = { ...updatedData };
    if (dataToUpdate.updated_at) {
      dataToUpdate.updated_at = Timestamp.fromDate(
        new Date(dataToUpdate.updated_at)
      );
    }
    if (dataToUpdate.created_at) {
      dataToUpdate.created_at = Timestamp.fromDate(
        new Date(dataToUpdate.created_at)
      );
    }

    await updateDoc(noteRef, dataToUpdate);
    console.log('Note updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const addNewNote = async (username, noteData) => {
  try {
    const notesRef = collection(db, 'notes');
    const currentTime = Timestamp.fromDate(new Date());
    
    const newNote = {
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      color: noteData.color || '#ffffff',
      starred: noteData.starred || false,
      owner: username,
      created_at: currentTime,
      updated_at: currentTime
    };

    const docRef = await addDoc(notesRef, newNote);
    console.log('Note added with ID: ', docRef.id);
    
    return true;
  } catch (error) {
    console.error('Error adding new note:', error);
    throw error;
  }
};

// Export Firebase services if needed elsewhere
export { auth, db, app };