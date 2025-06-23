import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const item = action.payload;
      // console.log(item);
      
      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) {
        if (quantity <= 0) {
          // If quantity is 0 or negative, remove the item
          state.items = state.items.filter((i) => i._id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove item if quantity becomes 0
          state.items = state.items.filter((i) => i._id !== id);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];  
    },
  },
});

export const { 
  setCart, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  increaseQuantity, 
  decreaseQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;