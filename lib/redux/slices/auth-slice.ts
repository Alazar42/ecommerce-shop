import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  user: { email: string } | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
}

// Check localStorage on init
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('auth_user')
  if (stored) {
    initialState.isAuthenticated = true
    initialState.user = JSON.parse(stored)
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('auth_user')
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
