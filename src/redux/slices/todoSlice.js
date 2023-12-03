import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    todos: [],
};

export const todoSlice = createSlice({
    name: "todos",
    initialState,
    // Not all todo handlers are duplicated in reducers, therefore keep in mind that redux isn’t the source of truth
    reducers: {
        addTodo: (state, action) => {
            state.todos = [...state.todos, action.payload];
        },
        toggleTodo: (state, action) => {
            state.todos = state.todos.map((todo) => {
                return todo.id === action.payload ? { ...todo, isCompleted: !todo.isCompleted } : { ...todo };
            });
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => {
                return todo.id !== action.payload;
            });
        },
        deleteCompletedTodos: (state) => {
            state.todos = state.todos.filter((todo) => {
                return !todo.isCompleted || todo.isSecure;
            });
        },
        clearAllTodos: (state) => {
            state.todos = [];
        },
    },
});

export const { addTodo, toggleTodo, deleteTodo, deleteCompletedTodos, clearAllTodos } = todoSlice.actions;

export default todoSlice.reducer;
