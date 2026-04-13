import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const dashboardPath = user?.role === 'employer' ? '/employer/dashboard'
    : user?.role === 'admin' ? '/admin'
    : '/seeker/dashboard'

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>H</span>
          <span className={styles.logoText}>Hired</span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <NavLink to="/jobs" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Browse Jobs
          </NavLink>
          {user?.role === 'employer' && (
            <NavLink to="/employer/post-job" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              Post a Job
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.avatar} onClick={() => setDropOpen(o => !o)}>
                <span className={styles.avatarInitial}>{user.name?.[0]?.toUpperCase()}</span>
                <span className={styles.userName}>{user.name?.split(' ')[0]}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {dropOpen && (
                <div className={styles.dropdown}>
                  <Link to={dashboardPath} className={styles.dropItem} onClick={() => setDropOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className={styles.dropItem} onClick={() => setDropOpen(false)}>
                    Profile
                  </Link>
                  <div className={styles.dropDivider} />
                  <button className={styles.dropItem} onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}

          <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
