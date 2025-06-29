import FirebaseAuth from "./FirebaseAuth.js"
import FirebaseUser from "./FirebaseUser.js"
import FirebaseNote from "./FirebaseNote.js"
import FirebaseTodo from "./FirebaseTodo.js";
import FirebaseWorkspace from "./FirebaseWorkspace.js"
import useAuthStore from "../store/authStore.js";
import { serverTimestamp } from "firebase/firestore";

// this is how we use them Firebase functions
// after testing, fix the FirebaseConfig.js

/**
 * func related to managing the workspace
 * getUserWorkspaces (variants: allUsersInWorkspace)
 * generateJoinToken
 * joinWorkspace
 * leaveWorkspace
 * addWorkspace
 * deleteWorkspace
 * updateWorkspace
 * 
 * func related to managing posts of a workspace
 * getWorkspacePosts
 * addPost
 * deletePost (variants: deleteAllPost)
 * updatePost
 */

async function test(){

    try {

        // // fetching all workspace of user
        // const list = await FirebaseWorkspace.getUserWorkspaces("zGPuor2qK1TvWsRV8H3LJaUQdwZ2");
        // console.log("list: ", list)

        // // adding a workspace (below is what should be passed to perimeter)
        // const mockWorkspace = {
        //     user: 'Siswa',
        //     userID: 'wM5sULPqoxOyinYIwZv9VfkkzUB2',
        //     name: 'Testing',
        //     description: 'To test workspace functions',
        //     updated_at: 'current date', // automatically handled
        //     created_at: 'current date', // automatically handled
        //     token: 'qwerty', // auto set to '' anyway.
        //     expiryToken: 'current date' // automatically handled
        // }
        // await FirebaseWorkspace.addWorkspace(mockWorkspace)

        // // checking the token validity
        // console.log(await FirebaseWorkspace.checkToken('qwerty')); // this supposed to be valid (as of now)
        // console.log(await FirebaseWorkspace.checkToken('12345678')); // this supposed to be invalid (as of now)

        // // joining the workspace (as a member)
        // await FirebaseWorkspace.joinWorkspace('zGPuor2qK1TvWsRV8H3LJaUQdwZ2', 'MDMDrRQiJI0lvvXAjots', false);

        // leaving the group
        // await FirebaseWorkspace.leaveWorkspace("zGPuor2qK1TvWsRV8H3LJaUQdwZ2", "MDMDrRQiJI0lvvXAjots");
        // console.log("imrannizal left the group");

        // // updating the group
        // const updateWorkspace = {
        //     name: "Hello world!",
        //     description: "To test workspace and hello the world!"
        // }
        // await FirebaseWorkspace.updateWorkspace("MDMDrRQiJI0lvvXAjots", updateWorkspace);

        // getting all users in a workspace (merely gives their id)
        // const allUserInWorkspace = await FirebaseWorkspace.allUsersInWorkspace('MDMDrRQiJI0lvvXAjots');
        // console.log("All users in testing workspace: ", allUserInWorkspace);

        // // add post
        // const addingPost = {
        //     workspaceID: "MDMDrRQiJI0lvvXAjots",
        //     user: 'imrannizal',
        //     title: 'All my fella 3',
        //     content: 'el gato',
        //     updated_at: 'current time', //dont matter, will automatic handled
        //     created_at: 'current time' // same thing
        // }
        // await FirebaseWorkspace.addPost(addingPost);
        // console.log("added post")

        // update post
        // const updatedPost = {
        //     title: 'Testing some shii number 2',
        //     content: 'updating stuff'
        // }
        // await FirebaseWorkspace.updatePost('m6ro4DtLXUauXo3pXEHT', updatedPost);
        // console.log("updated post");

        // // get workspace post
        // const allPost = await FirebaseWorkspace.getWorkspacePosts('tHL76aPbCYNkrggMWKpk');
        // console.log(allPost);

        // // delete post
        // await FirebaseWorkspace.deletePost('JEMTFqXKfHvCLSQyNcwG');
        // console.log("deleted post");

        // // delete all post (is actually working)
        // // delete workspace (do thuis after adding 2 or 3 posts)
        // await FirebaseWorkspace.deleteWorkspace('tHL76aPbCYNkrggMWKpk');
        // console.log("Deleted workspace, along with user-workspace relations, workspace's posts and workspace-post relations");

        // Firebase auth type shii
        // const userAuth = await FirebaseAuth.login("imrannizal@gmail.com", "No14bp34*");
        // console.log("1. Result (email):", userAuth.user.email);
        // console.log("1. Result (uid):", userAuth.user.uid)

        // // getting current user from auth
        // const testGetCurrentUser = FirebaseAuth.getCurrentUser(); // same data as userAuth
        // console.log("getting current user uid: ", testGetCurrentUser.uid);
        // if (testGetCurrentUser) console.log("getting current user email: ", testGetCurrentUser.email);
        // else console.log("nothing");

        // // FirebaseUser
        // // getting userdata
        // const userData = await FirebaseUser.getProfile(userAuth.user.uid);
        // console.log("2. Result (username):", userData.username)
        // console.log("2. Result (all):", userData)

        // updating user
        // const update = {
        //     username: "imrannizal2"
        //     other things... can be incomplete though.
        // }
        // await FirebaseUser.updateProfile(userAuth.user.uid, update);
        // const userData2 = await FirebaseUser.getProfile(userAuth.user.uid);
        // console.log("3. Result (username):", userData2.username)
        // console.log("3. Result (all):", userData2)

        // creating/setting user
        // const aqilData = {
        //     username: "Aqil0",
        //     email: "aqil@gmail.com",
        //     profile_picture: "testing"
        // }
        // const newUserAuth = await FirebaseAuth.signUp(aqilData.email, "Testing");
        // await FirebaseUser.setProfile(newUserAuth.user.uid, aqilData);
        // const aqilDataFromFireBase = await FirebaseUser.getProfile(newUserAuth.user.uid)
        // console.log("Aqil0 : ", aqilData);
        // console.log("Aqil0 firebase: ", aqilDataFromFireBase);

        // // removing user
        // console.log("deleting profile");
        // await FirebaseUser.deleteProfile(newUserAuth.user.uid);
        // console.log("Done deleting profile");
        // await FirebaseAuth.deleteUser("Testing");
        // const aqilDataFromFireBase2 = await FirebaseUser.getProfile(newUserAuth.user.uid)
        // console.log("Aqil0 firebase 2: ", aqilDataFromFireBase2); // will give error

        // FirebaseNote
        // getting all user notes (works)
        // const allUserNotes = await FirebaseNote.getUserNotes(userData.username)
        // console.log("All notes: ", allUserNotes)

        //deleteAllNote (will do later)

        // addNote
        // const mockNote = {
        //     owner: "imrannizal",
        //     title: "delete this note pls",
        //     content: "delete pls",
        //     colour: "test",
        //     starred: true
        // }
        // await FirebaseNote.addNote(mockNote);
        // console.log("added note")

        // deleteNote
        // await FirebaseNote.deleteNote("d5Y8zXZIFJexnBLKjvAF"); // noteID here
        // console.log("Deleted note")

        // updateNote
        // const editNote = {
        //     title: "Ballerina Cappucina"
        // }
        // await FirebaseNote.updateNote("FmT1sX4NzJGbRAM20is1", editNote)
        // console.log("edited note")

        //FirebaseTodo
        // addTodo
        // const mockTodos = {
        //     // deadline, description, title, is_completed, is_personal, owner, workspace
        //     deadline: serverTimestamp(),
        //     description: "revision",
        //     title: "study the materials",
        //     is_completed: false,
        //     is_personal: true,
        //     owner: "imrannizal",
        //     workspace: "Internet of Things"
        // }
        // await FirebaseTodo.addTodo(mockTodos);

        // updateTodo
        // const todoUpdate = {
        //     description: "Meet Dr. at his office with groupmates."
        // }
        // await FirebaseTodo.updateTodo("xEDjq4HS4ZUvxmzS3s9C", todoUpdate);

        // getUserTodos
        // const allTodos = await FirebaseTodo.getUserTodos("imrannizal");
        // console.log("All imrannizal todos: ", allTodos);

        // deleteTodo
        // await FirebaseTodo.deleteTodo("t8wAB9IyoQAXM12DWy7Q");
        // console.log("Deleted todo")

        // deleteSelectedTodos
        // const todoIdList = ["jra6YP4jNzV9EHREzYy4", "vaQPb5ddRuHmGn35652P"]
        // await FirebaseTodo.deleteSelectedTodos("imrannizal", todoIdList);
        // console.log("deleted several todos")

        // deleteAllUserTodos (later)


    } catch (err) {
        console.log("Error (test) : ", err);
        throw err
    }
}

test()