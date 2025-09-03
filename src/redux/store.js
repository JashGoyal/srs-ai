import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/slice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,

  },
});
