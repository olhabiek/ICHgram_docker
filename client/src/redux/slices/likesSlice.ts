import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { $api  } from '../../api/api';

export const likePost = createAsyncThunk(
  'likes/likePost',
  async ({ postId, userId }: { postId: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await $api.post(`/likes/${postId}/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error liking the post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'likes/unlikePost',
  async ({ postId, userId }: { postId: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await $api.delete(`/likes/${postId}/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error unliking the post');
    }
  }
);

const likesSlice = createSlice({
  name: 'likes',
  initialState: {
    likes: {} as { [postId: string]: boolean },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        state.likes[action.meta.arg.postId] = true;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.likes[action.meta.arg.postId] = false;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default likesSlice.reducer;
