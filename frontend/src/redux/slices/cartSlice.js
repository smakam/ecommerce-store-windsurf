import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Get cart items from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

// Get shipping address from localStorage
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

// Get payment method from localStorage
const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : '';

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  loading: false,
  error: null,
  success: false,
  userCart: null,
};

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/products/${id}`);

      const item = {
        product: data._id,
        name: data.name,
        image: data.images[0],
        price: data.discountPrice > 0 ? data.discountPrice : data.price,
        countInStock: data.countInStock,
        seller: data.seller,
        quantity,
      };

      const { auth } = getState();

      // If user is logged in, add to server cart
      if (auth.userInfo) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.userInfo.token}`,
          },
        };

        await api.post(
          '/api/cart',
          { productId: id, quantity },
          config
        );
      }

      return item;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      // If user is logged in, remove from server cart
      if (auth.userInfo) {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.userInfo.token}`,
          },
        };

        await api.delete(`/api/cart/${id}`, config);
      }

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

// Get user cart
export const getUserCart = createAsyncThunk(
  'cart/getUserCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      if (!userInfo) {
        return rejectWithValue('User not logged in');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.get('/api/cart', config);
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

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      // If user is logged in, update server cart
      if (auth.userInfo) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.userInfo.token}`,
          },
        };

        await api.put(`/api/cart/${id}`, { quantity }, config);
      }

      return { id, quantity };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      // If user is logged in, clear server cart
      if (auth.userInfo) {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.userInfo.token}`,
          },
        };

        await api.delete('/api/cart', config);
      }

      localStorage.removeItem('cartItems');
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    resetCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
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
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload;
        const existItem = state.cartItems.find((x) => x.product === item.product);

        if (existItem) {
          state.cartItems = state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          );
        } else {
          state.cartItems = [...state.cartItems, item];
        }

        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user cart
      .addCase(getUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.userCart = action.payload;
        
        // If user has items in their server cart, update local cart
        if (action.payload && action.payload.items && action.payload.items.length > 0) {
          state.cartItems = action.payload.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.images[0],
            price: item.price,
            countInStock: item.product.countInStock,
            seller: item.product.seller,
            quantity: item.quantity,
          }));
          
          localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const { id, quantity } = action.payload;
        state.cartItems = state.cartItems.map((item) =>
          item.product === id ? { ...item, quantity } : item
        );
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        state.success = true;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  saveShippingAddress,
  savePaymentMethod,
  resetCart,
  clearError,
  clearSuccess,
} = cartSlice.actions;

export default cartSlice.reducer;
