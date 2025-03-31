import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
  success: false,
  page: 1,
  pages: 1,
};

// Get all categories
export const listCategories = createAsyncThunk(
  'category/listCategories',
  async ({ keyword = '', pageNumber = 1 }, { rejectWithValue }) => {
    try {
      // Add the /api prefix to the endpoint
      const { data } = await api.get(
        `/api/categories?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get category details
export const getCategoryDetails = createAsyncThunk(
  'category/getCategoryDetails',
  async (id, { rejectWithValue }) => {
    try {
      // Add the /api prefix to the endpoint
      const { data } = await api.get(`/api/categories/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Create category (Admin)
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (categoryData, { getState, rejectWithValue }) => {
    try {
      // Add the /api prefix to the endpoint
      const { data } = await api.post('/api/categories', categoryData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update category (Admin)
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, ...categoryData }, { getState, rejectWithValue }) => {
    try {
      // Add the /api prefix to the endpoint
      const { data } = await api.put(`/api/categories/${id}`, categoryData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Delete category (Admin)
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id, { getState, rejectWithValue }) => {
    try {
      // Add the /api prefix to the endpoint
      await api.delete(`/api/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryDetails: (state) => {
      state.category = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // List categories
      .addCase(listCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(listCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(listCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get category details
      .addCase(getCategoryDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(getCategoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = action.payload;
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryDetails, clearError, clearSuccess } = categorySlice.actions;

export default categorySlice.reducer;
