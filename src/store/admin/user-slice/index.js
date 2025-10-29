import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  userList: [],
};

export const fetchAllUsers = createAsyncThunk(
  "/users/fetchAllUsers",
  async () => {
    const result = await axios.get("http://localhost:8080/api/admin/users/get");
    return result?.data;
  }
);

export const deleteUser = createAsyncThunk("/users/deleteUser", async (id) => {
  const result = await axios.delete(
    `http://localhost:8080/api/admin/users/delete/${id}`
  );

  return result?.data;
});

const AdminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.userList = [];
      });
  },
});

export default AdminUsersSlice.reducer;
