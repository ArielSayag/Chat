import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import { chatSlice } from "./chatSlice";


const store = configureStore({
  reducer: {
    userReducer: userSlice.reducer,
    chatReducer: chatSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store