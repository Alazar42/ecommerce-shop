import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FavoritesState {
  items: number[]
}

const initialState: FavoritesState = {
  items: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const index = state.items.indexOf(action.payload)
      if (index !== -1) {
        state.items.splice(index, 1)
      } else {
        state.items.push(action.payload)
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((id) => id !== action.payload)
    },
  },
})

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
