import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { loading, error, user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
    return () => dispatch(clearError())
  }, [user])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>H</span>
          </Link>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Sign in to your Hired account</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email" required
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password" required
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign in'}
          </button>
        </form>

        <p className={styles.switch}>
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
