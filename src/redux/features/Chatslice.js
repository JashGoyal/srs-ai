import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: {
      reducer: (state, action) => {
        state.messages.push(action.payload);
      },
      prepare: (message) => {
        // Attach a unique id to each message automatically
        return {
          payload: {
            id: nanoid(),
            ...message,
          },
        };
      },
    },
    updateMessage: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.messages.findIndex((msg) => msg.id === id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...updates };
      }
    },
  },
});

export const { addMessage, updateMessage } = chatSlice.actions;
export default chatSlice.reducer;
