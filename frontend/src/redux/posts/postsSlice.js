import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Async thunk to create a new post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axiosInstance.post('/posts', formData, {
        headers: {
          'auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get all posts of all users
export const getAllPosts = createAsyncThunk(
  'posts/getAllPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/posts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get a single post by ID
export const getPostById = createAsyncThunk(
  'posts/getPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to edit a post
export const editPost = createAsyncThunk(
  'posts/editPost',
  async ({ postId, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axiosInstance.put(`/posts/${postId}`, formData, {
        headers: {
          'auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axiosInstance.delete(`/posts/${postId}`, {
        headers: {
          'auth-token': token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to toggle like on a post
export const toggleLikePost = createAsyncThunk(
  'posts/toggleLikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axiosInstance.post(`/posts/${postId}/like`, {}, {
        headers: {
          'auth-token': token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get the list of users who liked a post
export const getPostLikers = createAsyncThunk(
  'posts/getPostLikers',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}/likers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to vote on a poll option
export const votePollOption = createAsyncThunk(
  'posts/votePollOption',
  async ({ postId, optionId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axiosInstance.post(`/posts/${postId}/poll/${optionId}/vote`, {}, {
        headers: {
          'auth-token': token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get poll results
export const getPollResults = createAsyncThunk(
  'posts/getPollResults',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}/poll/results`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    status: 'idle',
    error: null,
    pollResults: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.status = 'succeeded';
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        const existingPost = state.posts.find(post => post.id === action.payload.data.id);
        if (!existingPost) {
          state.posts.push(action.payload.data);
        } else {
          // Update existing post with fresh data
          const index = state.posts.findIndex(post => post.id === action.payload.data.id);
          state.posts[index] = action.payload.data;
        }
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        // Add the new post to the posts array
        state.posts.unshift(action.payload.data); // Prepend the new post to the array
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.data.id);
        if (index !== -1) {
          state.posts[index] = action.payload.data;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.meta.arg);
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.data.id);
        if (index !== -1) {
          state.posts[index] = action.payload.data;
        }
      })
      .addCase(getPostLikers.fulfilled, (state, action) => {
        const post = state.posts.find((post) => post.id === action.meta.arg);
        if (post) {
          post.likers = action.payload.data;
        }
      })
      .addCase(votePollOption.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.data.id);
        if (index !== -1) {
          state.posts[index] = action.payload.data;
        }
      })
      .addCase(getPollResults.fulfilled, (state, action) => {
        state.pollResults[action.meta.arg] = action.payload.data;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export default postsSlice.reducer;