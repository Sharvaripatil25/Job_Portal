import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

import Home              from './pages/Home'
import Login             from './pages/Login'
import Register          from './pages/Register'
import Jobs              from './pages/Jobs'
import JobDetail         from './pages/JobDetail'
import SeekerDashboard   from './pages/SeekerDashboard'
import EmployerDashboard from './pages/EmployerDashboard'
import PostJob           from './pages/PostJob'
import Profile           from './pages/Profile'
import AdminDashboard    from './pages/AdminDashboard'
import NotFound          from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs"     element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Seeker */}
        <Route path="/seeker/dashboard" element={
          <ProtectedRoute roles={['seeker']}>
            <SeekerDashboard />
          </ProtectedRoute>
        } />

        {/* Employer */}
        <Route path="/employer/dashboard" element={
          <ProtectedRoute roles={['employer']}>
            <EmployerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employer/post-job" element={
          <ProtectedRoute roles={['employer']}>
            <PostJob />
          </ProtectedRoute>
        } />

        {/* Shared - any logged-in user */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
