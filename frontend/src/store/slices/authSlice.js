import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosInstance'
import toast from 'react-hot-toast'

// Load persisted user
const savedUser = (() => {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
})()

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/users/profile', data)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: savedUser, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.success('Logged out')
    },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    const pending = (s) => { s.loading = true; s.error = null }
    const rejected = (s, a) => { s.loading = false; s.error = a.payload }

    builder
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload })
      .addCase(register.rejected, rejected)
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload })
      .addCase(login.rejected, rejected)
      .addCase(updateProfile.pending, pending)
      .addCase(updateProfile.fulfilled, (s, a) => { s.loading = false; s.user = a.payload })
      .addCase(updateProfile.rejected, rejected)
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
