import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer, { logout } from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

// Create a root reducer that will reset all state when a user logs out
const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
  user: userReducer,
});

// Root reducer that handles logout
const rootReducer = (state, action) => {
  // When logout action is dispatched, reset all state
  if (action.type === logout.fulfilled.type) {
    // Return initial state for all reducers
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
