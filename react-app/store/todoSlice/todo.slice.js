import { createSlice, nanoid } from '@reduxjs/toolkit';

import { initTodoThunk } from './todo.thunks';

// // instead of directly writing the reducer function by yourself, utilize the createSlice method
const todoSlice = createSlice({
  // // this name will be the prefix to the action's type, check Redux DevTools
  name: 'todo',
  initialState: {},
  // // with Redux Toolkit, you don't have to write pure functions anymore for the reducers, because the reducer functions are wrapped with immer.js which converts the impure logic into pure logic
  reducers: {
    // // login will be used as the suffix for action type, the final action type will be 'todo/addTodo'
    addTodo: (state, action) => {
      // // we don't need to use uuid library anymore, the @reduxjs/toolkit library provides a nanoid() method
      const id = nanoid();
      state[id] = {
        id,
        title: action.payload,
        completed: false,
      };
    },

    toggleTodo: (state, action) => {
      state[action.payload].completed = !state[action.payload].completed;
    },

    deleteTodo: (state, action) => {
      delete state[action.payload];
    },
  },

  // // this is for thunk actions
  extraReducers: (builder) => {
    // // other than thunk.fulfilled, we also have thunk.pending, and thunk.rejected, basically the three states of a promise
    builder.addCase(
      initTodoThunk.fulfilled,
      // // whatever is being returned by the thunk function will be passed to this callback function as action.payload, in our case, it will be a Todo[]
      (_state, action) => {
        return action.payload.reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {});
      },
    );
  },
});

export const { addTodo, toggleTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;
