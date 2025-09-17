import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/Chatslice';
import srsReducer from './features/srsSlice';
import srsHistoryReducer from './features/GetHistory';
import deleteSrsReducer from './features/deleteSrsSlice.js';
import srsSaveReducer from './features/srsSaveSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    srs: srsReducer,
    srsHistory: srsHistoryReducer,
    deleteSrs: deleteSrsReducer,
    srsSave: srsSaveReducer,
  },
});
