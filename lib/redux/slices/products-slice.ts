import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/client'

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
  total: number
  skip: number
  limit: number
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ skip = 0, limit = 10, search = '' }: { skip?: number; limit?: number; search?: string }) => {
    if (search) {
      const response = await apiClient.get(`/products/search?q=${search}&limit=${limit}&skip=${skip}`)
      return response.data
    }
    const response = await apiClient.get(`/products?limit=${limit}&skip=${skip}`)
    return response.data
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Partial<Product>) => {
    const response = await apiClient.post('/products/add', productData)
    return response.data
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: number; data: Partial<Product> }) => {
    const response = await apiClient.put(`/products/${id}`, data)
    return response.data
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number) => {
    await apiClient.delete(`/products/${id}`)
    return id
  }
)

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        const incomingSkip = action.payload.skip || 0
        if (incomingSkip === 0) {
          // First load or new search - replace items
          state.items = action.payload.products
        } else {
          // Infinite scroll - append items
          state.items = [...state.items, ...action.payload.products]
        }
        state.total = action.payload.total
        state.skip = incomingSkip
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch products'
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProductById.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch product'
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
  },
})

export const { clearError } = productsSlice.actions
export default productsSlice.reducer
