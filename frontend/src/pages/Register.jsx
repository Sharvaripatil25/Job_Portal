import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' })
  const { loading, error, user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/')
    return () => dispatch(clearError())
  }, [user])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    dispatch(register(form))
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>H</span>
          </Link>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.sub}>Join thousands of professionals on Hired</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input
              type="text" required
              className="form-input"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

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
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">I am a</label>
            <div className={styles.roleToggle}>
              {['seeker', 'employer'].map(r => (
                <button
                  key={r} type="button"
                  className={`${styles.roleBtn} ${form.role === r ? styles.roleActive : ''}`}
                  onClick={() => setForm(f => ({ ...f, role: r }))}
                >
                  {r === 'seeker' ? '👤 Job seeker' : '🏢 Employer'}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create account'}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
