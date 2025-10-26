import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/common/feature";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

// ✅ Lấy danh sách ảnh
export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async () => {
    const res = await axios.get(`${BASE_URL}/get`);
    return res.data;
  }
);

// ✅ Thêm ảnh mới
export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async ({ imageFile, type }) => {
    const formData = new FormData();
    formData.append("my_files", imageFile);
    formData.append("type", type);

    const res = await axios.post(`${BASE_URL}/add`, formData);
    return res.data.data;
  }
);

const commonSlice = createSlice({
  name: "commonFeature",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
  },
});

export default commonSlice.reducer;
