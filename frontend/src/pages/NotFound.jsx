import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.code}>404</span>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">Go home</Link>
          <Link to="/jobs" className="btn btn-ghost">Browse jobs</Link>
        </div>
      </div>
    </div>
  )
}
