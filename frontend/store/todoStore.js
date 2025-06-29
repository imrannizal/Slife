import { create } from 'zustand';
import FirebaseTodo from '../firebase/FirebaseTodo';

const useTodoStore = create((set, get) => ({
    todos: [],
    isLoading: false,
    error: null,

    // Fetch todos 
    fetchTodos: async (owner) => {
        set({ isLoading: true, error: null });
        try {
            const todos = await FirebaseTodo.getUserTodos(owner);
            set({ todos: todos, isLoading: false });
            return todos;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Add new todo
    addTodo: async (todoData) => {
        set({ isLoading: true });
        try {
            await FirebaseTodo.addTodo(todoData);
            await get().fetchTodos(todoData.owner); // Refresh list
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Update existing todo
    updateTodo: async (todoId, updates) => {
        set({ isLoading: true });
        try {
            await FirebaseTodo.updateTodo(todoId, updates);
            set(state => ({
                todos: state.todos.map(todo =>
                    todo.id === todoId ? { ...todo, ...updates } : todo
                ),
                isLoading: false
            }));
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    toggleTodoComplete: async (todoId) => {
        const todo = get().todos.find(todo => todo.id === todoId);
        if (!todo) return;

        try {
            set({ isLoading: true });

            // Optimistic update
            set({
                todos: get().todos.map(todo =>
                    todo.id === todoId ? { ...todo, is_completed: !todo.is_completed } : todo
                )
            });

            // Firestore update
            await FirebaseTodo.updateTodo(todoId, {
                is_completed: !todo.is_completed
            });

            set({ isLoading: false });
        } catch (err) {
            // Revert on error
            set({
                todos: get().todos,
                isLoading: false,
                error: err.message
            });
            console.log("Error toggling complete (todoStore.js) : ", err);
            throw err;
        }
    },

    // Delete single todo
    deleteTodo: async (todoId) => {
        set({ isLoading: true });
        try {
            await FirebaseTodo.deleteTodo(todoId);
            set(state => ({
                todos: state.todos.filter(todo => todo.id !== todoId),
                isLoading: false
            }));
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Delete multiple todos
    deleteSelectedTodos: async (owner, todoIds) => {
        set({ isLoading: true });
        try {
            await FirebaseTodo.deleteSelectedTodos(owner, todoIds);
            set(state => ({
                todos: state.todos.filter(todo => !todoIds.includes(todo.id)),
                isLoading: false
            }));
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    autoDeleteCompletedTodos: async (owner) => {
        set({ isLoading: true });
        try {
            // Get all completed todo IDs first
            const completedTodoIds = get().todos
                .filter(todo => todo.owner === owner && todo.is_completed)
                .map(todo => todo.id);

            if (completedTodoIds.length === 0) {
                set({ isLoading: false });
                return { count: 0 }; // Early return if nothing to delete
            }

            // Delete from Firestore
            await FirebaseTodo.deleteSelectedTodos(owner, completedTodoIds);

            // Update local state
            set(state => ({
                todos: state.todos.filter(todo => !completedTodoIds.includes(todo.id)),
                isLoading: false
            }));

            return { count: completedTodoIds.length }; // Return count of deleted items
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Clear all todos (for account deletion)
    deleteAllTodos: async (owner) => {
        set({ isLoading: true });
        try {
            await FirebaseTodo.deleteAllUserTodos(owner);
            set({ todos: [], isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    logout: () => {
        set({ todos: [] });
    }

}));

export default useTodoStore;