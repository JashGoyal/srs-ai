import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/Chatslice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
