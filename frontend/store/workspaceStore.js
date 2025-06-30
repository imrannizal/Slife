import { create } from 'zustand';
import FirebaseWorkspace from '../firebase/FirebaseWorkspace';

const useWorkspaceStore = create((set, get) => ({
    workspaces: [],
    posts: [],
    postsUnsubscribe: null,
    isLoading: false,
    error: null,

    // Get all current user's workspaces (executed when is inside "list of workspaces" page)
    fetchWorkspaces: async (userID) => {
        set({ isLoading: true, error: null });
        try {
            const workspaces = await FirebaseWorkspace.getUserWorkspaces(userID); // gets a list of workspaces and their attributes
            set({ workspaces: workspaces, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error fetching the user's workspaces (workspaceStore): ", err);
            throw err;
        }
    },

    // Get all workspace's posts (executed when is inside "list of workspaces" page, before entering the actual workspace)
    fetchWorkspacePosts: async (workspaceID) => {
        set({ isLoading: true, error: null });
        try {
            const posts = await FirebaseWorkspace.getWorkspacePosts(workspaceID); // gets a list of workspaces and their attributes
            set({ 
                posts: posts, 
                isLoading: false
            });
            return true;

        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error fetching the workspace's posts (workspaceStore): ", err);
            throw err;
        }
    },

    // Real-time post management
    startPostsListener: (workspaceID) => {
        // Cleanup previous listener
        get().stopPostsListener();

        // Delegate to FirebaseWorkspace
        const unsubscribe = FirebaseWorkspace.subscribeToPosts(
            workspaceID,
            (posts) => set({ posts })
        );

        set({ postsUnsubscribe: unsubscribe });
    },

    stopPostsListener: () => {
        const { postsUnsubscribe } = get();
        if (postsUnsubscribe) {
            postsUnsubscribe();
            set({ postsUnsubscribe: null, posts: [] });
        }
    },

    // should evaluate the token (if token given == token inside database (need to fetch the data first), and token != expired then proceed)
    // need to make a way that automatically updates the post/workspace whenever their "table" is updated. (useCallback maybe?)
    // executed when is inside "list of workspaces" page
    joinWorkspace: async (token, userID) => {
        set({ isLoading: true, error: null });
        try {

            const workspaceID = await FirebaseWorkspace.checkToken(token);

            // this checks if token is valid
            if (workspaceID) {

                // join the workspace as normal member
                await FirebaseWorkspace.joinWorkspace(userID, workspaceID, false);

                // re-fetch all user workspaces
                await get().fetchWorkspaces(userID);

                return true;
            } else {
                // if the token is invalid, print error
                console.log("Error; either the token is false or it has expired.")
                set({ isLoading: false })

                return false;
            }
        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error checking token/joining workspace (workspaceStore): ", err);
            throw err;
        }
    },

    // Generate a join token by updating the 'token' and 'expiryToken' (for 1 day) (executed by admin(s) inside current workspace)
    generateJoinToken: async (workspaceID) => {
        try {
            // Generate and save the token
            const generatedToken = await FirebaseWorkspace.generateJoinToken(workspaceID);

            // modify local state immediately (optimistic ui update method)
            set((state) => ({
                workspaces: state.workspaces.map(ws =>
                    ws.id === workspaceID
                        ? {
                            ...ws,
                            token: generatedToken.token,
                            expiryToken: generatedToken.expiryToken
                        }
                        : ws
                ),
            }));

            return generatedToken;
        } catch (err) {
            set({ error: err.message });
            console.error("Token generation failed (workspaceStore): ", err);
            throw err;
        }
    },

    // Leave workspace by deleting user_workspace document in the firestore (executed when inside current workspace page)
    leaveWorkspace: async (userID, workspaceID) => {
        set({ isLoading: true, error: null });
        try {
            // calling function
            const success = await FirebaseWorkspace.leaveWorkspace(userID, workspaceID);

            // optimistic ui update method
            if (success) {
                set((state) => ({
                    workspaces: state.workspaces.filter(ws => ws.id !== workspaceID), // Remove the workspace (from user)
                    isLoading: false
                }));
            }
        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error leaving workspace (workspaceStore): ", err);
            throw err;
        }
    },

    // Create workspace (executed inside "list of workspace" page)
    createWorkspace: async (data) => {
        set({ isLoading: true, error: null });
        try {
            // Call firebase to add the new workspaces
            await FirebaseWorkspace.addWorkspace(data);

            // fetch all user Data back
            await get().fetchWorkspaces(data.userID);
        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error creating a workspace (workspaceStore): ", err);
            throw err;
        }
    },

    // Delete workspace (executed by owner inside current workspace page)
    deleteWorkspace: async (workspaceID) => {
        set({ isLoading: true, error: null });
        try {
            // Call firebase to remove the workspace
            await FirebaseWorkspace.deleteWorkspace(workspaceID);

            // optimistic ui update method
            set((state) => ({
                workspaces: state.workspaces.filter(ws => ws.id !== workspaceID), // Remove the workspace
                posts: [],
                isLoading: false
            }));

        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error deleting the workspace (workspaceStore): ", err);
            throw err;
        }
    },

    // update workspace (executed by admin [or owner] inside current workspace page)
    updateWorkspace: async (userID, workspaceID, data) => {
        set({ isLoading: true, error: null });
        try {
            // Call firebase to update the workspace
            await FirebaseWorkspace.updateWorkspace(workspaceID, data);

            // modify local state immediately (optimistic ui update method)
            set((state) => ({
                workspaces: state.workspaces.map(ws => ws.id === workspaceID ? { ...data } : ws),
                isLoading: false
            }));

        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error updating the workspace (workspaceStore): ", err);
            throw err;
        }
    },

    exitWorkspace: () => {
        set({ posts: [] });
    },

    // add post (can be done by anyone), executed inside current workspace page
    addPost: async(workspaceID, data) => {
        set({ isLoading: true, error: null });
        try {
            // add current workspaceID
            data = {
                ...data,
                workspaceID: workspaceID
            }

            // call firebase
            await FirebaseWorkspace.addPost(data);

        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error adding a post to the workspace (workspaceStore): ", err);
            throw err;
        }
    },

    // delete post (can be done by owner), executed inside current workspace page
    deletePost: async (postID) => {
        set({ isLoading: true, error: null });
        try {
            // call firebase to delete post
            await FirebaseWorkspace.deletePost(postID);

        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error deleting a post in the workspace (workspaceStore): ", err);
            throw err;
        }
    },

    // update post (can be done by owner), executed inside current workspace page
    updatePost: async(postID, data) => {
        set({ isLoading: true, error: null });
        try {
            // update post at the firestore
            await FirebaseWorkspace.updatePost(postID, data)

        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.log("Error updating the post (workspaceStore): ", err);
            throw err;
        }
    },

    logout: () => {
        set({ posts: [], workspaces: [], postsUnsubscribe: null})
    }

}));

export default useWorkspaceStore;