import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Dashboard Stats
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// User Management
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async ({ page = 1, limit = 10, search = '', role = '' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/users', {
        params: { page, limit, search, role }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/admin/users/role', { userId, role });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleUserVerification = createAsyncThunk(
  'admin/toggleUserVerification',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/admin/users/verify', { userId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createAdminUser = createAsyncThunk(
  'admin/createAdminUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/users/create-admin', userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Post Management
export const fetchAllPosts = createAsyncThunk(
  'admin/fetchAllPosts',
  async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/posts', {
        params: { page, limit, search }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  'admin/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  // Dashboard
  dashboardStats: null,
  
  // Users
  users: [],
  totalUsers: 0,
  currentPage: 1,
  totalPages: 0,
  
  // Posts
  posts: [],
  totalPosts: 0,
  postsCurrentPage: 1,
  postsTotalPages: 0,
  
  // Loading states
  loading: false,
  usersLoading: false,
  postsLoading: false,
  
  // Error states
  error: null,
  usersError: null,
  postsError: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.usersError = null;
      state.postsError = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPostsCurrentPage: (state, action) => {
      state.postsCurrentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch dashboard stats';
      })
      
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload?.message || 'Failed to fetch users';
      })
      
      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(user => user.id === action.payload.userId);
        if (userIndex !== -1) {
          state.users[userIndex].role = action.payload.role;
        }
      })
      
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalUsers -= 1;
      })
      
      // Toggle User Verification
      .addCase(toggleUserVerification.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(user => user.id === action.payload.userId);
        if (userIndex !== -1) {
          state.users[userIndex].isDpVerify = action.payload.isDpVerify;
        }
      })
      
      // Create Admin User
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.totalUsers += 1;
      })
      
      // Fetch All Posts
      .addCase(fetchAllPosts.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.posts = action.payload.posts;
        state.totalPosts = action.payload.totalPosts;
        state.postsCurrentPage = action.payload.currentPage;
        state.postsTotalPages = action.payload.totalPages;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload?.message || 'Failed to fetch posts';
      })
      
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
        state.totalPosts -= 1;
      });
  },
});

export const { clearError, setCurrentPage, setPostsCurrentPage } = adminSlice.actions;
export default adminSlice.reducer;