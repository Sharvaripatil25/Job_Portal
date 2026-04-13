import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosInstance'

export const applyToJob = createAsyncThunk('applications/apply', async ({ jobId, data }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/applications/${jobId}/apply`, data)
    return res.data.application
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Application failed')
  }
})

export const fetchMyApplications = createAsyncThunk('applications/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/applications/my')
    return res.data.applications
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications')
  }
})

export const fetchJobApplications = createAsyncThunk('applications/fetchForJob', async (jobId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/applications/job/${jobId}`)
    return res.data.applications
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications')
  }
})

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/applications/${id}/status`, { status })
    return res.data.application
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

const applicationSlice = createSlice({
  name: 'applications',
  initialState: { myList: [], jobList: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (s) => { s.loading = true })
      .addCase(fetchMyApplications.fulfilled, (s, a) => { s.loading = false; s.myList = a.payload })
      .addCase(fetchMyApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchJobApplications.pending, (s) => { s.loading = true })
      .addCase(fetchJobApplications.fulfilled, (s, a) => { s.loading = false; s.jobList = a.payload })
      .addCase(fetchJobApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(applyToJob.fulfilled, (s, a) => { s.myList.unshift(a.payload) })
      .addCase(updateApplicationStatus.fulfilled, (s, a) => {
        const idx = s.jobList.findIndex(app => app._id === a.payload._id)
        if (idx !== -1) s.jobList[idx] = a.payload
      })
  },
})

export default applicationSlice.reducer
