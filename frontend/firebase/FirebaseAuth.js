import { auth } from './FirebaseConfig.js'; // Import initialized auth instance
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';

class FirebaseAuth{

    // Authentication
    signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    logout = () => {
        return signOut(auth);
    };

    // Deleting user needs more security procedures
    deleteUser = async (currentPassword) => {
        const user = auth.currentUser;
        
        if (!user || !user.email) {
            throw new Error('No authenticated user');
        }

        // 1. Reauthenticate (critical security step)
        const credential = EmailAuthProvider.credential(
            user.email, 
            currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        // 2. Delete user account
        await deleteUser(user);
    };


    // Password
    resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    updateUserEmail = (user, newEmail) => {
        return updateEmail(user, newEmail);
    };

    updateUserPassword = (user, newPassword) => {
        return updatePassword(user, newPassword);
    };


    // Auth observer
    subscribeToAuthChanges = (callback) => {
        return onAuthStateChanged(auth, callback);
    };


    // Current User
    getCurrentUser = () => {
        return auth.currentUser;
    };

}

export default new FirebaseAuth();