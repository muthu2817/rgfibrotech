// src/features/users/usersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../API/axiosInterceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data.data.users;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const usersSlice = createSlice({
  name: 'Users',
  initialState: {
    UserItem: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.UserItem = action.payload.users;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
} = usersSlice.actions;

export default usersSlice.reducer;
