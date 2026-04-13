import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosInstance'

export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/jobs', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs')
  }
})

export const fetchJobById = createAsyncThunk('jobs/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/jobs/${id}`)
    return res.data.job
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Job not found')
  }
})

export const createJob = createAsyncThunk('jobs/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/jobs', data)
    return res.data.job
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create job')
  }
})

export const updateJob = createAsyncThunk('jobs/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/jobs/${id}`, data)
    return res.data.job
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update job')
  }
})

export const deleteJob = createAsyncThunk('jobs/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/jobs/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete job')
  }
})

export const fetchEmployerJobs = createAsyncThunk('jobs/fetchEmployer', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/jobs/employer/my-jobs')
    return res.data.jobs
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs')
  }
})

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [], total: 0, pages: 1,
    current: null,
    employerJobs: [],
    loading: false,
    error: null,
    filters: { search: '', location: '', type: '', page: 1 },
  },
  reducers: {
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload } },
    clearCurrent(state) { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchJobs.fulfilled, (s, a) => {
        s.loading = false
        s.list = a.payload.jobs
        s.total = a.payload.total
        s.pages = a.payload.pages
      })
      .addCase(fetchJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchJobById.pending, (s) => { s.loading = true })
      .addCase(fetchJobById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload })
      .addCase(fetchJobById.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(createJob.fulfilled, (s, a) => { s.employerJobs.unshift(a.payload) })
      .addCase(updateJob.fulfilled, (s, a) => {
        const idx = s.employerJobs.findIndex(j => j._id === a.payload._id)
        if (idx !== -1) s.employerJobs[idx] = a.payload
      })
      .addCase(deleteJob.fulfilled, (s, a) => {
        s.employerJobs = s.employerJobs.filter(j => j._id !== a.payload)
      })
      .addCase(fetchEmployerJobs.pending, (s) => { s.loading = true })
      .addCase(fetchEmployerJobs.fulfilled, (s, a) => { s.loading = false; s.employerJobs = a.payload })
      .addCase(fetchEmployerJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { setFilters, clearCurrent } = jobSlice.actions
export default jobSlice.reducer
