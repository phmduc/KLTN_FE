import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    listCart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const hasItem = state.listCart.find(
        (item) =>
          item.ID === action.payload.ID && item.size === action.payload.size
      );
      if (hasItem) {
        hasItem.count = Number(hasItem.count) + Number(action.payload.count);
        localStorage.setItem("cartItem", JSON.stringify(state.listCart));
      } else {
        state.listCart = [...state.listCart, action.payload];
        localStorage.setItem("cartItem", JSON.stringify(state.listCart));
      }
    },
    removeFromCart: (state, action) => {
      const cartItem = localStorage.getItem("cartItem")
        ? JSON.parse(localStorage.getItem("cartItem"))
        : [];
      const newItem = cartItem.filter((elem, index) => {
        return (
          elem.ID !== action.payload.ID || elem.size !== action.payload.size
        );
      });
      state.listCart = newItem;
      localStorage.setItem("cartItem", JSON.stringify(state.listCart));
    },
    removeAll: (state, action) => {
      state.listCart = [];
    },
  },
});
export const { addToCart, removeFromCart, removeAll } = cartSlice.actions;

export default cartSlice.reducer;
