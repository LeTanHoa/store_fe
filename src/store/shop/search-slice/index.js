import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
  error: null,
};

export const getSearchResults = createAsyncThunk(
  "shopSearch/getSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://storebe-api.vercel.app/api/shop/search/${keyword}`
      );
      // response.data = { success: true, data: [...] }
      return response.data.data; // ✅ Trả về mảng sản phẩm
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Search request failed"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "shopSearch",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload || []; // ✅ đúng
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.searchResults = [];
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
