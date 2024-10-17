// // the createSelector method actually comes from the reselect library, it will create a memoized selector
import { createSelector } from '@reduxjs/toolkit';

// // general selector that returns the slice of state we need, need to be used in our actual selectors
const selectTodoState = (state) => state.todo;

export const selectTodoIds = createSelector(selectTodoState, (todos) =>
  Object.keys(todos),
);

export const selectTodoById = (id) =>
  createSelector(selectTodoState, (todos) => todos[id]);
