import { db } from './FirebaseConfig.js';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

class FirebaseUser {
  // Reference to the 'users' collection
  _collection = collection(db, 'users');

  /**
   * Creates/overwrites a user profile
   * @param {string} uid 
   * @param {{
   *   username?: string,
   *   profile_picture?: string,
   *   created_at?: timestamp
   *   email?: string
   * }} data 
   */
  async setProfile(uid, email, username) {
    await setDoc(doc(this._collection, uid), {
      email: email,
      username: username,
      profile_picture: "https://picsum.photos/400/300.jpg",
      created_at: serverTimestamp()
    });
  }

  /**
   * Gets a user profile
   * @param {string} uid 
   * @returns {Promise<{
   *   username?: string,
   *   email?: string,
   *   profile_picture?: string,
   *   created_at: timestamp
   * } | null>}
   */
  async getProfile(uid) {
    const snap = await getDoc(doc(this._collection, uid));
    return snap.exists() ? snap.data() : null;
  }

  /**
   * Updates specific profile fields
   * @param {string} uid 
   * @param {{
   *   username?: string,
   *   profile_picture?: string,
   *   created_at?: timestamp
   *   email?: string
   * }} data 
   */
  async updateProfile(uid, updates) {
    await updateDoc(doc(this._collection, uid), {
      ...updates
    });
  }

  /**
   * Deletes a user profile
   * @param {string} uid
   */
  async deleteProfile(uid) {
    await deleteDoc(doc(this._collection, uid));
  }

  /**
   * Finds users by metadata (e.g., all '@company.com' users)
   * @param {string} field 
   * @param {string} operator 
   * @param {any} value 
   * @returns {Promise<Array<{
   *   uid: string,
   *   [key: string]: any
   * }>>}
   */
  async findUsers(field, operator, value) {
    const q = query(
      this._collection,
      where(field, operator, value)
    );
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ uid: d.id, ...d.data() }));
  }
}

export default new FirebaseUser();