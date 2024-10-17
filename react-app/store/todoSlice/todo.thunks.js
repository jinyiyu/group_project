import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';

import axios from 'axios';

// // we don't have to manually write thunk action creators anymore
export const initTodoThunk = createAsyncThunk(
  // // this string will be used as the action type, check Redux DevTools
  'todo/initTodoThunk',
  async () => {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/todos',
    );

    const todos = data.slice(0, 4).map((todo) => {
      delete todo.userId;
      todo.id = nanoid();
      return todo;
    });

    // // we can directly return the data we want our reducer to handle, it will automatically be passed as the action's payload
    return todos;
  },
);
