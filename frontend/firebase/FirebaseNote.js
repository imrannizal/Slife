import { db } from './FirebaseConfig.js';
import { 
  doc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

class FirebaseNote {

    _collection = collection(db, 'notes');

    async getUserNotes(owner) {
        try {
            const noteQuery = query(
                this._collection,
                where('owner', '==', owner)
            )
            const querySnapshot = await getDocs(noteQuery);
            const noteList = []

            querySnapshot.forEach((doc) => {
                const { updated_at, created_at, ...rest } = doc.data();

                noteList.push({
                    id: doc.id, // Include Firestore document ID
                    ...rest,
                    updated_at: new Date(updated_at.seconds * 1000), // converting from firebase to js date format
                    created_at: new Date(created_at.seconds * 1000)
                });
            })

            return noteList;
        } catch (err) {
            console.log("Error catching user files (FirebaseNote.js) : ", err);
            throw err;
        }
    }

    async deleteNote(noteID) {
        try{
            await deleteDoc(doc(this._collection, noteID));
        } catch (err) {
            console.log("Error deleting note (FirebaseNote.js) : ", err);
            throw err;
        }
    }

    // delete all Notes (in case of account deletion)
    async deleteAllUserNotes(owner){
        try{
            const noteQuery = query(
                this._collection,
                where("owner", "==", owner)
            )
            const querySnapshot = await getDocs(noteQuery);

            // Batch delete operation (more efficient)
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref); // batches documents into one unit (no deletion yet)
            });

            // commit the whole note batch deletion
            await batch.commit();
        } catch (err) {
            console.log("Error deleting all notes (FirebaseNotes.js) : ", err);
            throw err;
        }
    }

    /**
     * 
     * @param {{
     *  color?: string,
     *  content?: string,
     *  created_at: timestamp,
     *  owner: string,
     *  starred?: boolean,
     *  title?: string,
     *  updated_at: timestamp
     * }} data 
     * updated_at and created_at is automatically defined here.
     */
    async addNote (data) {
        try {

            await setDoc(doc(this._collection), {
                ...data, // owner, title, content, colour, starred
                updated_at: serverTimestamp(),
                created_at: serverTimestamp()
            })

        } catch (err) {
            console.log("Error adding note (FirebaseNote.js) : ", err);
            throw err;
        }
    }

    /**
     * @param {string} noteID
     * @param {{
     *  color?: string,
     *  content?: string,
     *  created_at?: timestamp,
     *  owner?: string,
     *  starred?: boolean,
     *  title?: string,
     *  updated_at?: timestamp
     * }} data 
     */
    async updateNote (noteID, data) {
        try {
            await updateDoc(doc(this._collection, noteID), {
                ...data, // owner, title, content, colour, starred, created_at
                updated_at: serverTimestamp() // updated now
            })
        } catch (err) {
            console.log("Error updating note (FirebaseNote.js) : ", err);
            throw err;
        }
    }

}

export default new FirebaseNote();