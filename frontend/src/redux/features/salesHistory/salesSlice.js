import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  salesHistory: [],
  totalSalesAmount: 0, // Initialize as 0, assuming it's a numeric value.
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    STORE_SALES(state, action) {
      // Instead of reassigning, use the state's immer capability to update the array.
      state.salesHistory = action.payload;
    },
    CALC_TOTAL_SALES_AMOUNT(state) { // No need to pass 'action' here.
      const array = state.salesHistory.map((item) => item.salesAmount);
      const totalAmount = array.reduce((a, b) => a + b, 0);
      state.totalSalesAmount = totalAmount;
    },
  },
});

export const { STORE_SALES, CALC_TOTAL_SALES_AMOUNT } = salesSlice.actions;

export const selectSalesHistory = (state) => state.sales.salesHistory;
export const selectTotalSalesAmount = (state) => state.sales.totalSalesAmount;

export default salesSlice.reducer;
