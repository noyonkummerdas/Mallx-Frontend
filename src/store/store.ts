import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from '@/modules/shopping/store/cartSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
