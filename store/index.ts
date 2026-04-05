import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import taskReducer from './taskSlice';
export const store = configureStore({
  reducer: {
    task: taskReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
