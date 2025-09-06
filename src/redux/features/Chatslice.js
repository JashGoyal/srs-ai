import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(
        (msg) => msg.sender === action.payload.sender && msg.text === action.payload.text && msg.replied === false
      );
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...action.payload };
      }
    },
  },
});

export const { addMessage, updateMessage } = chatSlice.actions;
export default chatSlice.reducer;
