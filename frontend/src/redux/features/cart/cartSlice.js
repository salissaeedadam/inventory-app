// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from "react-toastify"


const cartItemsFromLocalStorage = localStorage.getItem("cartItems");
const initialState = {
  cartItems: cartItemsFromLocalStorage ? JSON.parse(cartItemsFromLocalStorage) : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  previousURL: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ADD_TO_CART(state, action) {
      //   console.log(action.payload);
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (productIndex >= 0) {
        // Item already exists in the cart
        // Increase the cartQuantity
        state.cartItems[productIndex].cartQuantity += 1;
        toast.info(`${action.payload.name} increased by one`, {
          position: "top-left",
        });
      } else {
        // Item doesn't exists in the cart
        // Add item to the cart
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
        toast.success(`${action.payload.name} added to cart`, {
          position: "top-left",
        });
      }
      // save cart to LS
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    CALC_CART_VALUE(state, action) {
      const cartItems = action.payload;
    
      // Check if cartItems is an array before using map
      if (Array.isArray(cartItems)) {
        const array = [];
        cartItems.map((item) => {
          const { price, quantity } = item;
          const productValue = price * quantity;
          return array.push(productValue);
        });
        
        const totalValue = array.reduce((a, b) => {
          return a + b;
        }, 0);
        
        state.totalStoreValue = totalValue;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      } else {
        // Handle the case where cartItems is not an array (e.g., show an error, return, or perform a different action).
      }
    },
    
    DECREASE_CART(state, action) {
      console.log(action.payload);
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (state.cartItems[productIndex].cartQuantity > 1) {
        state.cartItems[productIndex].cartQuantity -= 1;
        toast.info(`${action.payload.name} decreased by one`, {
          position: "top-left",
        });
      } else if (state.cartItems[productIndex].cartQuantity === 1) {
        const newCartItem = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );
        state.cartItems = newCartItem;
        toast.success(`${action.payload.name} removed from cart`, {
          position: "top-left",
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    REMOVE_FROM_CART(state, action) {
      const newCartItem = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );

      state.cartItems = newCartItem;
      toast.success(`${action.payload.name} removed from cart`, {
        position: "top-left",
      });

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    CLEAR_CART(state, action) {
      state.cartItems = [];
      toast.info(`Cart cleared`, {
        position: "top-left",
      });

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    CALCULATE_SUBTOTAL(state, action) {
      const array = [];
      state.cartItems.map((item) => {
        const { price, cartQuantity } = item;
        const cartItemAmount = price * cartQuantity;
        return array.push(cartItemAmount);
      });
      const totalAmount = array.reduce((a, b) => {
        return a + b;
      }, 0);
      state.cartTotalAmount = totalAmount;
    },
    CALCULATE_TOTAL_QUANTITY(state, action) {
      const array = [];
      state.cartItems.map((item) => {
        const { cartQuantity } = item;
        const quantity = cartQuantity;
        return array.push(quantity);
      });
      const totalQuantity = array.reduce((a, b) => {
        return a + b;
      }, 0);
      state.cartTotalQuantity = totalQuantity;
    },
    SAVE_URL(state, action) {
      console.log(action.payload);
      state.previousURL = action.payload;
    },
  },
});

export const {
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  SAVE_URL,
  CALC_CART_VALUE,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity;
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount;
export const selectPreviousURL = (state) => state.cart.previousURL;
export const cartItems = (state) => state.cart.cartItems;

export default cartSlice.reducer;