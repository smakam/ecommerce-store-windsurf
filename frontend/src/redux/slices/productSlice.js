import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  success: false,
  page: 1,
  pages: 1,
  reviews: [],
};

// Get all products
export const getProducts = createAsyncThunk(
  'product/getProducts',
  async ({ keyword = '', pageNumber = '', category = '', sort = '' }, { rejectWithValue }) => {
    try {
      console.log('Fetching products with params:', { keyword, pageNumber, category, sort });
      
      // Build the URL with proper query parameters
      // We need to add the /api prefix to all endpoints
      const url = `/api/products?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(pageNumber)}`;
      
      // Only add category and sort if they have values
      const urlWithParams = category ? `${url}&category=${encodeURIComponent(category)}` : url;
      const finalUrl = sort ? `${urlWithParams}&sort=${encodeURIComponent(sort)}` : urlWithParams;
      
      console.log('Making API request to:', finalUrl);
      
      const { data } = await api.get(finalUrl);
      console.log('Products data received:', { count: data.products?.length, page: data.page, pages: data.pages });
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get product details
export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      // Add the /api prefix to the endpoint
      const { data } = await api.get(`/api/products/${id}`);
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

// Create product review
export const createProductReview = createAsyncThunk(
  'product/createProductReview',
  async ({ productId, review }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Add the /api prefix to the endpoint
      await api.post(`/api/products/${productId}/reviews`, review, config);
      return { success: true };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get top rated products
export const getTopProducts = createAsyncThunk(
  'product/getTopProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Add the /api prefix to the endpoint
      const { data } = await api.get('/api/products/top');
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

// Create product (seller/admin)
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Add the /api prefix to the endpoint
      const { data } = await api.post('/api/products', productData, config);
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

// Update product (seller/admin)
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ productId, productData }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Add the /api prefix to the endpoint
      const { data } = await api.put(`/api/products/${productId}`, productData, config);
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

// Delete product (seller/admin)
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Add the /api prefix to the endpoint
      await api.delete(`/api/products/${id}`, config);
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

// Get seller products
export const getSellerProducts = createAsyncThunk(
  'product/getSellerProducts',
  async ({ pageNumber = '' }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Add the /api prefix to the endpoint
      const { data } = await api.get(`/api/products/seller?page=${pageNumber}`, config);
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

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
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
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get product details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product review
      .addCase(createProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get top products
      .addCase(getTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(getTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = [...state.products, action.payload];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload;
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter((product) => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get seller products
      .addCase(getSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetails, clearError, clearSuccess } = productSlice.actions;

export default productSlice.reducer;
