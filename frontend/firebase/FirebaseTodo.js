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
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';

class FirebaseTodo{

    _collection = collection(db, "todos");

    // getUserTodos
    async getUserTodos(owner) {
        try{
            const todoQuery = query(
                this._collection,
                where('owner', '==', owner)
            )
            const querySnapshot = await getDocs(todoQuery);
            const todoList = []

            querySnapshot.forEach((doc) => {
                const { updated_at, created_at, deadline, ...rest } = doc.data();
                todoList.push({
                    id: doc.id, // Include Firestore document ID
                    ...rest,
                    updated_at: new Date(updated_at.seconds * 1000), // converting from firebase to js date format
                    created_at: new Date(created_at.seconds * 1000),
                    deadline: new Date(deadline.seconds * 1000 )
                });
            })

            return todoList;


        } catch (err) {
            console.log("Error catching all user todos (FirebaseTodo.js): ", err);
            throw err;
        }
    }

    // getTodo (will implement later... maybe)


    // deleteTodo
    async deleteTodo(todoID){
        try {
            await deleteDoc(doc(this._collection, todoID));
        } catch (err) {
            console.log("Error deleting todo (FirebaseTodo.js): ", err);
            throw err;
        }

    }

    // deleteSelectedTodos
    async deleteSelectedTodos(owner, todoIdList) {
        try {
            const todoQuery = query(
                this._collection,
                where("owner", "==", owner)
            )
            const querySnapshot = await getDocs(todoQuery);

            const todosToDelete = querySnapshot.docs.filter(doc => 
                todoIdList.includes(doc.id)
            );

            const batch = writeBatch(db);
            todosToDelete.forEach((doc) => {
                batch.delete(doc.ref)
            });

            await batch.commit();
        } catch (err) {
            console.log("Error deleting all selected todos (FirebaseTodo.js): ", err);
            throw err;
        }
    }

    // deleteAllUserTodos (account deletion)
    async deleteAllUserTodos(owner) {
        try {
            const todoQuery = query(
                this._collection,
                where("owner", "==", owner)
            )
            const querySnapshot = await getDocs(todoQuery);

            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();

        } catch (err) {
            console.log("Error deleting all todos (FirebaseTodo.js): ", err);
            throw err;
        }

    }

    // addTodo
    async addTodo(data) {
        try {
            await setDoc(doc(this._collection), {
                ...data, // deadline, description, title, is_completed, is_personal, owner, workspace
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

        } catch (err) {
            console.log("Error adding todo (FirebaseTodo.js): ", err);
            throw err;
        }

    }

    // updateTodo
    async updateTodo(todoID, data) {
        try {
            await updateDoc(doc(this._collection, todoID), {
                ...data, // deadline, description, title, is_completed, is_personal, owner, workspace, created_at
                updated_at: serverTimestamp()
            });
        } catch (err) {
            console.log("Error updating todo (FirebaseTodo.js): ", err);
            throw err;
        }

    }

}

export default new FirebaseTodo();