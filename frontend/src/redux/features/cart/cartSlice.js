// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Initialize an empty cart
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Add a product to the cart
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      // Remove a product from the cart by its ID or some identifier
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // Add more cart-related actions as needed
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
