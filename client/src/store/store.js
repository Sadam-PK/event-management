import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import eventReducer from "./features/events/eventSlice";
import registerReducer from "./features/register/registerSlice";

export const store = configureStore({
  reducer: {
    register: registerReducer,
    auth: authReducer,
    user: userReducer,
    event: eventReducer,
  },
});
