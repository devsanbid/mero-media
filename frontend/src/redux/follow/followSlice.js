import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Async thunk to follow a user
export const followUser = createAsyncThunk(
  'follow/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/follow/follow', { userId });
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to unfollow a user
export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/follow/unfollow', { userId });
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get followers list
export const getFollowers = createAsyncThunk(
  'follow/getFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/follow/followers/${userId}`);
      return { userId, followers: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get following list
export const getFollowing = createAsyncThunk(
  'follow/getFollowing',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/follow/following/${userId}`);
      return { userId, following: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get follow status
export const getFollowStatus = createAsyncThunk(
  'follow/getFollowStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/follow/status/${userId}`);
      return { userId, status: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    followers: {},
    following: {},
    followStatus: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    clearFollowData: (state) => {
      state.followers = {};
      state.following = {};
      state.followStatus = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        if (state.followStatus[userId]) {
          state.followStatus[userId].isFollowing = true;
        } else {
          state.followStatus[userId] = { isFollowing: true, isFollowedBy: false };
        }
        state.status = 'succeeded';
      })
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        if (state.followStatus[userId]) {
          state.followStatus[userId].isFollowing = false;
        } else {
          state.followStatus[userId] = { isFollowing: false, isFollowedBy: false };
        }
        state.status = 'succeeded';
      })
      // Get followers
      .addCase(getFollowers.fulfilled, (state, action) => {
        const { userId, followers } = action.payload;
        state.followers[userId] = followers;
        state.status = 'succeeded';
      })
      // Get following
      .addCase(getFollowing.fulfilled, (state, action) => {
        const { userId, following } = action.payload;
        state.following[userId] = following;
        state.status = 'succeeded';
      })
      // Get follow status
      .addCase(getFollowStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        state.followStatus[userId] = status;
        state.status = 'succeeded';
      })
      // Handle all pending states
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
        }
      )
      // Handle all rejected states
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export const { clearFollowData } = followSlice.actions;
export default followSlice.reducer;