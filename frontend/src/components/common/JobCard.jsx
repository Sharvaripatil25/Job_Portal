import { Link } from 'react-router-dom'
import styles from './JobCard.module.css'

const typeColors = {
  'full-time': 'badge-green',
  'part-time': 'badge-blue',
  'remote': 'badge-gold',
  'internship': 'badge-default',
}

export default function JobCard({ job }) {
  const posted = new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <Link to={`/jobs/${job._id}`} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.companyLogo}>
          {job.company?.logo
            ? <img src={job.company.logo} alt={job.company.name} />
            : <span>{job.company?.name?.[0] || 'C'}</span>
          }
        </div>
        <div className={styles.meta}>
          <span className={styles.company}>{job.company?.name || 'Company'}</span>
          <span className={`badge ${typeColors[job.type] || 'badge-default'}`}>{job.type}</span>
        </div>
      </div>

      <h3 className={styles.title}>{job.title}</h3>

      <div className={styles.details}>
        <span className={styles.detail}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 7 3a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg>
          {job.location}
        </span>
        {job.salary?.min && (
          <span className={styles.detail}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {job.salary.currency || '₹'}{(job.salary.min / 1000).toFixed(0)}k–{(job.salary.max / 1000).toFixed(0)}k
          </span>
        )}
      </div>

      {job.requirements?.length > 0 && (
        <div className={styles.tags}>
          {job.requirements.slice(0, 3).map(r => (
            <span key={r} className={`badge badge-default ${styles.tag}`}>{r}</span>
          ))}
          {job.requirements.length > 3 && (
            <span className={`badge badge-default ${styles.tag}`}>+{job.requirements.length - 3}</span>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.posted}>{posted}</span>
        <span className={styles.apply}>View role →</span>
      </div>
    </Link>
  )
}
