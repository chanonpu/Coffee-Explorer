import { configureStore, createSlice } from '@reduxjs/toolkit';

// Initial state for the cart
const initialState = {
  items: [],
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  // reducer to receive addItem, removeItem, changeQuantity action and updta the item status
  reducers: {
    // addItem action
    addItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    // remove Item action
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    // increase quantity action
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    // decrease quantity action
    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    // reset state action
    resetState: (state) => {
      state.items = []; // Reset the state to the initial state
    },
  },
});

export const { addItem, removeItem, increaseQuantity, decreaseQuantity, resetState } =
  cartSlice.actions;

// create store to store and manage state
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export default store;
