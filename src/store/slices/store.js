import { configureStore } from '@reduxjs/toolkit';
import loginUserSlice from './slices/loginUserSlice';
export const store = configureStore({
  reducer: {
    user: loginUserSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});