import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Function to check if the user is logged in based on the token in localStorage
const getInitialAuthState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    return !!token;
  }
  return false;
};

// Define the initial state
const initialState = {
  isLoggedIn: getInitialAuthState(),
  user: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch user details');
    }
  }
);

// Add this to the authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      if (action.payload.token) {
        localStorage.setItem('auth-token', action.payload.token);
      }
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('auth-token');
      state.user = null;
    },
    updateUserDetails(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isLoggedIn = true;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload?.error === 'Pls authenticate using a valid token') {
          state.isLoggedIn = false;
          localStorage.removeItem('auth-token');
          state.user = null;
        }
      });
  },
});

export const { setLoggedIn, logout, updateUserDetails } = authSlice.actions;
export default authSlice.reducer;