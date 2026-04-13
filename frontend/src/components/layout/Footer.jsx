import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>H</span>
            <span className={styles.logoText}>Hired</span>
          </div>
          <p className={styles.tagline}>Find work that matters.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <span className={styles.groupTitle}>Jobs</span>
            <Link to="/jobs">Browse all</Link>
            <Link to="/jobs?type=remote">Remote</Link>
            <Link to="/jobs?type=full-time">Full-time</Link>
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.groupTitle}>Employers</span>
            <Link to="/employer/post-job">Post a job</Link>
            <Link to="/employer/dashboard">Dashboard</Link>
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.groupTitle}>Account</span>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Hired. All rights reserved.</p>
      </div>
    </footer>
  )
}
