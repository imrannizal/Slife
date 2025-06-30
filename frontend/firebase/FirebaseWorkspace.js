import { db } from './FirebaseConfig.js';
import * as Crypto from 'expo-crypto';
import {
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    getDoc,
    serverTimestamp,
    writeBatch,
    onSnapshot,
} from 'firebase/firestore';

class FirebaseWorkspace {

    user_WorkspaceCollection = collection(db, 'user_workspace');
    workspaceCollection = collection(db, 'workspaces');
    workspace_postCollection = collection(db, 'workspace_post');
    postCollection = collection(db, 'posts');

    // get current user's workspace (includes all that he joined and he created)
    // user_workspace collection
    /**
     * workspace attributes:
     * - id
     * - title
     * - description
     * - created_by/owner
     * - created_at
     * - updated_at
     * - admin names (string array) 
     * - join token
     * - expiry token
     * 
     * post attributes:
     * - id
     * - title
     * - content
     * - owner
     * - created_at
     * - updated_at
     */

    async getUserWorkspaces(userID) {
        try {
            // Get user's workspace relations
            const workspaceQuery = query(
                this.user_WorkspaceCollection,
                where('userID', '==', userID)
            );
            const querySnapshot = await getDocs(workspaceQuery);

            // Extract workspace IDs and roles
            const workspacePromises = [];
            querySnapshot.forEach((snap) => {

                const { workspaceID, role } = snap.data();

                workspacePromises.push(
                    getDoc(doc(this.workspaceCollection, workspaceID))
                        .then(workspaceSnap => {
                            const data = workspaceSnap.data();
                            const { created_at, updated_at, expiryToken, ...rest } = data;

                            return {
                                ...rest,
                                id: workspaceSnap.id,
                                role,
                                created_at: new Date(created_at.seconds * 1000),
                                updated_at: new Date(updated_at.seconds * 1000),
                                expiryToken: new Date(expiryToken?.seconds * 1000) || null
                            };
                        }));

            });

            // Fetch all workspaces in parallel
            const workspaceList = await Promise.all(workspacePromises);

            return workspaceList // Filter out deleted workspaces

        } catch (err) {
            console.error("Error fetching user workspaces:", err);
            throw err;
        }
    }

    // join workspace
    // this is for setting up user_workspace table
    // assuming the token has not expired yet
    async joinWorkspace(userID, workspaceID, isAdmin) {
        try {
            await setDoc(doc(this.user_WorkspaceCollection), {
                userID: userID,
                workspaceID: workspaceID,
                role: isAdmin ? 'admin' : 'member'
            })
        } catch (err) {
            console.log("Error joining workspace (FirebaseWorkspace.js) : ", err);
            throw err;
        }
    }

    // Check for workspaces with the same token as in params
    // return true or false
    async checkToken(token) {
        try {
            const tokenQuery = query(
                this.workspaceCollection,
                where("token", "==", token)
            )
            const querySnapshot = await getDocs(tokenQuery);

            // if there is no workspace retrieved it means user entered wrong token
            if (querySnapshot.empty) return false;

            const workspaceDoc = querySnapshot.docs[0];
            const { expiryToken } = workspaceDoc.data();

            // Check whehter the token is expired or not
            const isTokenValid = expiryToken?.toDate() > new Date();

            // Auto-update the token and expiryToken to null if token time has expired 
            if (!isTokenValid) {
                await updateDoc(workspaceDoc.ref, {
                    token: null,
                    expiryToken: null
                });

                return null;
            }

            return workspaceDoc.id;

        } catch (err) {
            console.log("Failed checking token of every workspace (FirebaseWorkspace): ", err)
            throw err;
        }

    }

    // get all workspace's posts
    async getWorkspacePosts(workspaceID) {
        try {
            const postQuery = query(
                this.workspace_postCollection,
                where('workspaceID', '==', workspaceID)
            );
            const querySnapshot = await getDocs(postQuery);

            // 
            const postPromises = [];
            querySnapshot.forEach((snap) => {

                const { postID } = snap.data();

                postPromises.push(
                    getDoc(doc(this.postCollection, postID))
                        .then(postSnap => {
                            const data = postSnap.data();
                            const { created_at, updated_at, ...rest } = data;

                            return {
                                ...rest,
                                id: postSnap.id,
                                created_at: new Date(created_at.seconds * 1000),
                                updated_at: new Date(updated_at.seconds * 1000),
                            };

                        }));

            });

            // Fetch all workspaces in parallel
            const postList = await Promise.all(postPromises);

            return postList;

        } catch (err) {
            console.log("Error catching workspace's post (FirebaseWorkspace.js) : ", err);
            throw err;
        }
    }

    // real time sync with the posts
    subscribeToPosts(workspaceID, callback) {
        const postsQuery = query(
            this.workspace_postCollection,
            where('workspaceID', '==', workspaceID)
        );

        return onSnapshot(postsQuery, async (snapshot) => {

            const postIDs = snapshot.docs.map(doc => doc.data().postID);

            if (postIDs.length === 0) {
                callback([]);
                return;
            }

            const postsQuery = query(
                this.postCollection,
                where('__name__', 'in', postIDs)
            );

            const postsSnapshot = await getDocs(postsQuery);

            const posts = postsSnapshot.docs.map(doc => {
                const data = doc.data();
                const { created_at, updated_at, ...rest } = data;

                return {
                    id: doc.id,
                    ...data,
                    created_at: new Date(created_at.seconds * 1000),
                    updated_at: new Date(updated_at.seconds * 1000)
                };

            })

            callback(posts);
        });
    }

    // getting all the user_workspace data/relationship for a specific workspace (only gives their id)
    async allUsersInWorkspace(workspaceID) {
        try {
            const workspaceQuery = query(
                this.user_WorkspaceCollection,
                where('workspaceID', '==', workspaceID)
            )
            const querySnapshot = await getDocs(workspaceQuery);
            const user_workspaceList = []

            querySnapshot.forEach((doc) => {
                user_workspaceList.push({
                    id: doc.id, // Include Firestore document ID
                    userID: doc.data().userID,
                    workspaceID: doc.data().workspaceID
                });
            })

            return user_workspaceList;
        } catch (err) {
            console.log("Error catching all user in a workspace (FirebaseWorkspace.js) : ", err);
            throw err;
        }
    }

    // add workspace (have to set up workspace and user_workspace)
    /**
     * parameter 'data' should have:
     * - user (username)
     * - userID
     * - name (workspace name)
     * - description
     * - updated_at
     * - created_at
     * - token
     * - expiryToken
     */
    async addWorkspace(data) {
        try {
            // adding to the 'workspaces' table
            const newWorkspaceRef = doc(this.workspaceCollection);
            await setDoc(newWorkspaceRef, {
                owner: data.owner,
                name: data.name,
                description: data.description,
                updated_at: serverTimestamp(),
                created_at: serverTimestamp(),
                token: null,
                expiryToken: null
            })

            // joining workspace (using same function inside this class)
            this.joinWorkspace(data.userID, newWorkspaceRef.id, true);

        } catch (err) {
            console.log("Error adding workspace (FirebaseWorkspace.js) : ", err);
            throw err;
        }
    }

    // leave workspace (quite a heavy task)
    async leaveWorkspace(userID, workspaceID) {
        try {
            const q = query(
                this.user_WorkspaceCollection,
                where('workspaceID', '==', workspaceID),
                where('userID', '==', userID)
            )
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            return true;

        } catch (err) {
            console.log("Error leaving group (FirebaseWorkspace.js) :", err);
            throw err;
        }
    }

    // delete workspace (workspace owner only)
    async deleteWorkspace(workspaceID) {
        try {

            // have to delete posts related to workspace first
            this.deleteAllPost(workspaceID);

            // now we proceed to deleting the workspace itself

            // delete the workspace inside the workspaces table
            await deleteDoc(doc(this.workspaceCollection, workspaceID));

            // have to find ALL user_workspace documents that is related to said workspace
            // because we need to delete all of the existing relationship between the workspace and user
            // use the same func inside this class (this returns all use of the workspace)
            const user_workspaceList = await this.allUsersInWorkspace(workspaceID);

            // deleting (related) user_workspace docs in one batch
            const batch = writeBatch(db);
            user_workspaceList.forEach(relation => {
                batch.delete(doc(this.user_WorkspaceCollection, relation.id));
            })

            await batch.commit();
        } catch (err) {
            console.log("Error deleting workspace (FirebaseWorkspace): ", err);
            throw err;
        }
    }

    // create invite token
    // assume it is admin that is generating
    async generateJoinToken(workspaceID) {

        const generateSecureToken = async (length = 12) => {
            const byteArray = new Uint8Array(length);
            await Crypto.getRandomValues(byteArray); // random bytes

            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Alphabets and numbers
            return Array.from(byteArray)
                .map(byte => chars[byte % chars.length])
                .join('')
                .slice(0, length);
        };

        try {
            const workspaceTokenData = {
                token: await generateSecureToken(),
                expiryToken: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 days
            }

            await updateDoc(doc(this.workspaceCollection, workspaceID), {
                token: workspaceTokenData.token,
                expiryToken: workspaceTokenData.expiryToken
            });

            return workspaceTokenData;  // returns the token and the expiryToken
        } catch (err) {
            console.error("Error generating token (FirebaseWorkspace): ", err);
            throw err;
        }
    }

    // update workspace
    /**
     * parameter 'data' should have:
     * - user (username)
     * - name (workspace name)
     * - description
     * - updated_at
     * - created_at
     */
    async updateWorkspace(workspaceID, data) {
        try {
            console.log(data)
            await updateDoc(doc(this.workspaceCollection, workspaceID), {
                name: data.name,
                description: data.description,
                image: data.image,
                created_at: new Date(data.created_at),
                updated_at: serverTimestamp() // updated now
            })
        } catch (err) {
            console.log("Error updating workspace (FirebaseWorkspace.js) : ", err);
            throw err;
        }
    }

    // add post
    /**
     * post attributes:
     * - workspaceID
     * - title
     * - content
     * - owner
     * - created_at
     * - updated_at
     */
    async addPost(data) {
        try {
            // adding post to "posts" table
            const newPostRef = doc(this.postCollection);
            await setDoc(newPostRef, {
                owner: data.owner,
                title: data.title,
                content: data.content,
                updated_at: serverTimestamp(),
                created_at: serverTimestamp()
            })

            // adding to "workspace_post" table

            await setDoc(doc(this.workspace_postCollection), {
                postID: newPostRef.id,
                workspaceID: data.workspaceID
            })

        } catch (err) {
            console.log("Error adding post (FirebaseWorkspace): ", err);
            throw err;
        }
    }

    // Workspace deletion case
    async deleteAllPost(workspaceID) {
        try {
            // first, find all the workspace_post docs ID via workspaceID
            // then get the post ID for the posts table 
            // delete them
            // then we delete the workspace_post docs

            const postQuery = query(
                this.workspace_postCollection,
                where("workspaceID", "==", workspaceID)
            )
            const querySnapshot = await getDocs(postQuery); // this is doc id for workspace_post table

            const batch = writeBatch(db);
            querySnapshot.forEach((snap) => {
                const postID = snap.data().postID;
                batch.delete(doc(this.postCollection, postID));
                batch.delete(doc(this.workspace_postCollection, snap.id));
            });

            await batch.commit();

        } catch (err) {
            console.log("Error in deleting all posts (FirebaseWorkspace): ", err);
            throw err;
        }
    }

    // delete post (post owner only) (also assume current owner is post owner)
    async deletePost(postID) {
        try {
            // Delete the doc inside the 'posts' table
            await deleteDoc(doc(this.postCollection, postID));

            // Delete the doc inside 'workspace_post' table
            const postQuery = query(
                this.workspace_postCollection,
                where("postID", "==", postID)
            )
            const querySnapshot = await getDocs(postQuery); // this is doc id for workspace_post table

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

        } catch (err) {
            console.log("Error deleting post (FirebaseWorkspace): ", err);
            throw err;
        }
    }

    // update post
    async updatePost(postId, data) {
        try {
            await updateDoc(doc(this.postCollection, postId), {
                ...data,
                updated_at: serverTimestamp()
            });
        } catch (err) {
            console.log("Error updating post (FirebaseWorkspace): ", err);
            throw err;
        }
    }

}

export default new FirebaseWorkspace();