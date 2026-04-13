import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchEmployerJobs, deleteJob } from '../store/slices/jobSlice'
import { fetchJobApplications, updateApplicationStatus } from '../store/slices/applicationSlice'
import toast from 'react-hot-toast'
import styles from './EmployerDashboard.module.css'

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']
const STATUS_META = {
  pending:     { label: 'Pending',     cls: 'badge-default' },
  reviewed:    { label: 'Reviewed',    cls: 'badge-blue' },
  shortlisted: { label: 'Shortlisted', cls: 'badge-gold' },
  rejected:    { label: 'Rejected',    cls: 'badge-red' },
  hired:       { label: 'Hired',       cls: 'badge-green' },
}

export default function EmployerDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { employerJobs, loading: jobsLoading } = useSelector(s => s.jobs)
  const { jobList: applications, loading: appsLoading } = useSelector(s => s.applications)
  const [activeTab, setActiveTab] = useState('jobs')
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => { dispatch(fetchEmployerJobs()) }, [])

  useEffect(() => {
    if (selectedJob) dispatch(fetchJobApplications(selectedJob))
  }, [selectedJob])

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return
    const res = await dispatch(deleteJob(id))
    if (!res.error) toast.success('Job deleted')
    else toast.error(res.payload)
  }

  const handleStatusChange = async (appId, status) => {
    const res = await dispatch(updateApplicationStatus({ id: appId, status }))
    if (!res.error) toast.success(`Status updated to ${status}`)
    else toast.error(res.payload)
  }

  const stats = {
    activeJobs: employerJobs.filter(j => j.isActive).length,
    totalApplicants: employerJobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0),
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
  }

  return (
    <div className="page">
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>Employer dashboard</h1>
            <p>Manage your job postings and review candidates, {user?.name?.split(' ')[0]}.</p>
          </div>
          <Link to="/employer/post-job" className="btn btn-primary">+ Post a job</Link>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { label: 'Active listings', val: stats.activeJobs, icon: '📋' },
            { label: 'Total applicants', val: stats.totalApplicants, icon: '👥' },
            { label: 'Shortlisted', val: stats.shortlisted, icon: '⭐' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-nav">
          {['jobs', 'applications'].map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t === 'jobs' ? `My jobs (${employerJobs.length})` : 'Applications'}
            </button>
          ))}
        </div>

        {/* Jobs tab */}
        {activeTab === 'jobs' && (
          <div>
            {jobsLoading ? (
              <div className={styles.skelList}>{Array(3).fill(0).map((_, i) => <div key={i} className={styles.skelRow} />)}</div>
            ) : employerJobs.length === 0 ? (
              <div className="empty-state">
                <h3>No jobs posted yet</h3>
                <p>Create your first job listing to start receiving applications</p>
                <Link to="/employer/post-job" className="btn btn-primary">Post a job</Link>
              </div>
            ) : (
              <div className={styles.jobList}>
                {employerJobs.map(job => (
                  <div key={job._id} className={styles.jobRow}>
                    <div className={styles.jobInfo}>
                      <p className={styles.jobTitle}>{job.title}</p>
                      <p className={styles.jobMeta}>{job.location} · {job.type} · {job.applications?.length || 0} applicants</p>
                    </div>
                    <div className={styles.jobStatus}>
                      <span className={`badge ${job.isActive ? 'badge-green' : 'badge-default'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div className={styles.jobActions}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setSelectedJob(job._id); setActiveTab('applications') }}
                      >
                        View applicants ({job.applications?.length || 0})
                      </button>
                      <Link to={`/employer/edit-job/${job._id}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <button className={`btn btn-sm ${styles.deleteBtn}`} onClick={() => handleDelete(job._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications tab */}
        {activeTab === 'applications' && (
          <div>
            <div className={styles.jobSelector}>
              <select
                className={`form-input form-select ${styles.jobSelect}`}
                value={selectedJob || ''}
                onChange={e => setSelectedJob(e.target.value)}
              >
                <option value="">— Select a job to view applicants —</option>
                {employerJobs.map(j => (
                  <option key={j._id} value={j._id}>{j.title} ({j.applications?.length || 0})</option>
                ))}
              </select>
            </div>

            {!selectedJob ? (
              <div className="empty-state">
                <h3>Select a job</h3>
                <p>Choose a job posting above to see its applicants</p>
              </div>
            ) : appsLoading ? (
              <div className={styles.skelList}>{Array(4).fill(0).map((_, i) => <div key={i} className={styles.skelRow} />)}</div>
            ) : applications.length === 0 ? (
              <div className="empty-state"><h3>No applications yet</h3><p>Share your job listing to attract candidates</p></div>
            ) : (
              <div className={styles.appList}>
                {applications.map(app => {
                  const meta = STATUS_META[app.status] || STATUS_META.pending
                  const applied = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  return (
                    <div key={app._id} className={styles.appRow}>
                      <div className={styles.appAvatar}>
                        {app.applicant?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className={styles.appInfo}>
                        <p className={styles.appName}>{app.applicant?.name || 'Applicant'}</p>
                        <p className={styles.appEmail}>{app.applicant?.email} · Applied {applied}</p>
                        {app.coverLetter && (
                          <details className={styles.coverDetails}>
                            <summary>View cover letter</summary>
                            <p className={styles.coverText}>{app.coverLetter}</p>
                          </details>
                        )}
                      </div>
                      <div className={styles.appActions}>
                        <span className={`badge ${meta.cls}`}>{meta.label}</span>
                        <select
                          className={styles.statusSelect}
                          value={app.status}
                          onChange={e => handleStatusChange(app._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
