import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMyApplications } from '../store/slices/applicationSlice'
import styles from './SeekerDashboard.module.css'

const STATUS_META = {
  pending:     { label: 'Pending',     cls: 'badge-default' },
  reviewed:    { label: 'Reviewed',    cls: 'badge-blue' },
  shortlisted: { label: 'Shortlisted', cls: 'badge-gold' },
  rejected:    { label: 'Rejected',    cls: 'badge-red' },
  hired:       { label: 'Hired 🎉',    cls: 'badge-green' },
}

export default function SeekerDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { myList, loading } = useSelector(s => s.applications)

  useEffect(() => { dispatch(fetchMyApplications()) }, [])

  const stats = {
    total: myList.length,
    shortlisted: myList.filter(a => a.status === 'shortlisted').length,
    hired: myList.filter(a => a.status === 'hired').length,
    pending: myList.filter(a => a.status === 'pending').length,
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My dashboard</h1>
          <p>Welcome back, {user?.name?.split(' ')[0]}. Here's your job search summary.</p>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { label: 'Applications', val: stats.total, icon: '📋' },
            { label: 'Pending review', val: stats.pending, icon: '⏳' },
            { label: 'Shortlisted', val: stats.shortlisted, icon: '⭐' },
            { label: 'Offers received', val: stats.hired, icon: '🎉' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Applications */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>My applications</h2>
            <Link to="/jobs" className="btn btn-ghost btn-sm">Browse more jobs</Link>
          </div>

          {loading ? (
            <div className={styles.loadingList}>
              {Array(3).fill(0).map((_, i) => <div key={i} className={styles.skelRow} />)}
            </div>
          ) : myList.length === 0 ? (
            <div className="empty-state">
              <h3>No applications yet</h3>
              <p>Start applying to jobs that match your skills</p>
              <Link to="/jobs" className="btn btn-primary">Browse jobs</Link>
            </div>
          ) : (
            <div className={styles.appList}>
              {myList.map(app => {
                const meta = STATUS_META[app.status] || STATUS_META.pending
                const posted = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                return (
                  <div key={app._id} className={styles.appRow}>
                    <div className={styles.appLogo}>
                      {app.job?.company?.logo
                        ? <img src={app.job.company.logo} alt="" />
                        : <span>{app.job?.company?.name?.[0] || 'C'}</span>
                      }
                    </div>
                    <div className={styles.appInfo}>
                      <Link to={`/jobs/${app.job?._id}`} className={styles.appTitle}>
                        {app.job?.title || 'Job title'}
                      </Link>
                      <span className={styles.appCompany}>{app.job?.company?.name} · Applied {posted}</span>
                    </div>
                    <span className={`badge ${meta.cls}`}>{meta.label}</span>
                    {app.coverLetter && (
                      <details className={styles.coverLetterDetails}>
                        <summary>Cover letter</summary>
                        <p className={styles.coverLetterText}>{app.coverLetter}</p>
                      </details>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
