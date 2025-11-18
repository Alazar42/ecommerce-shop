import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/products-slice'
import favoritesReducer from './slices/favorites-slice'
import themeReducer from './slices/theme-slice'
import authReducer from './slices/auth-slice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
