import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobById, clearCurrent } from '../store/slices/jobSlice'
import { applyToJob } from '../store/slices/applicationSlice'
import toast from 'react-hot-toast'
import styles from './JobDetail.module.css'

const typeColors = { 'full-time': 'badge-green', 'part-time': 'badge-blue', 'remote': 'badge-gold', 'internship': 'badge-default' }

export default function JobDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: job, loading } = useSelector(s => s.jobs)
  const { user } = useSelector(s => s.auth)
  const { myList } = useSelector(s => s.applications)
  const [showModal, setShowModal] = useState(false)
  const [applying, setApplying] = useState(false)
  const [form, setForm] = useState({ coverLetter: '' })

  useEffect(() => {
    dispatch(fetchJobById(id))
    return () => dispatch(clearCurrent())
  }, [id])

  const alreadyApplied = myList.some(a => a.job?._id === id || a.job === id)
  const posted = job ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setApplying(true)
    const res = await dispatch(applyToJob({ jobId: id, data: form }))
    setApplying(false)
    if (!res.error) {
      toast.success('Application submitted!')
      setShowModal(false)
    } else {
      toast.error(res.payload || 'Application failed')
    }
  }

  if (loading) return (
    <div className="page"><div className="container">
      <div className={styles.loadingGrid}>
        <div><div className={`${styles.skel} ${styles.skelH}`} /><div className={`${styles.skel} ${styles.skelP}`} /><div className={`${styles.skel} ${styles.skelP}`} /></div>
        <div className={`${styles.skel} ${styles.skelCard}`} />
      </div>
    </div></div>
  )

  if (!job) return (
    <div className="page"><div className="container">
      <div className="empty-state"><h3>Job not found</h3><button className="btn btn-ghost" onClick={() => navigate('/jobs')}>← Back to jobs</button></div>
    </div></div>
  )

  return (
    <div className="page">
      <div className="container">
        <button className={styles.back} onClick={() => navigate(-1)}>← Back to jobs</button>

        <div className={styles.layout}>
          {/* Main content */}
          <article className={styles.main}>
            <div className={styles.jobHeader}>
              <div className={styles.companyLogo}>
                {job.company?.logo
                  ? <img src={job.company.logo} alt={job.company.name} />
                  : <span>{job.company?.name?.[0] || 'C'}</span>
                }
              </div>
              <div>
                <p className={styles.companyName}>{job.company?.name}</p>
                <h1 className={styles.jobTitle}>{job.title}</h1>
                <div className={styles.jobMeta}>
                  <span className={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 7 3a1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg>
                    {job.location}
                  </span>
                  {job.salary?.min && (
                    <span className={styles.metaItem}>
                      ₹{(job.salary.min/100000).toFixed(1)}L – ₹{(job.salary.max/100000).toFixed(1)}L/yr
                    </span>
                  )}
                  <span className={`badge ${typeColors[job.type] || 'badge-default'}`}>{job.type}</span>
                </div>
              </div>
            </div>

            {job.requirements?.length > 0 && (
              <div className={styles.section}>
                <h3>Required skills</h3>
                <div className={styles.skillTags}>
                  {job.requirements.map(r => (
                    <span key={r} className="badge badge-default">{r}</span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h3>About this role</h3>
              <p className={styles.description}>{job.description}</p>
            </div>

            {job.deadline && (
              <div className={styles.deadlineNote}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4v3.5l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Apply by {new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            )}
          </article>

          {/* Sidebar card */}
          <aside className={styles.sidebar}>
            <div className={styles.applyCard}>
              <p className={styles.posted}>Posted {posted}</p>
              <p className={styles.applicantCount}>{job.applications?.length || 0} applicants</p>

              {user?.role === 'seeker' ? (
                alreadyApplied ? (
                  <div className={styles.appliedBadge}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Application submitted
                  </div>
                ) : (
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowModal(true)}>
                    Apply now
                  </button>
                )
              ) : !user ? (
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/login')}>
                  Sign in to apply
                </button>
              ) : null}

              <div className="divider" />

              <div className={styles.cardDetails}>
                {[
                  { label: 'Job type', val: job.type },
                  { label: 'Location', val: job.location },
                  job.salary?.min && { label: 'Salary', val: `₹${(job.salary.min/100000).toFixed(1)}L–${(job.salary.max/100000).toFixed(1)}L` },
                ].filter(Boolean).map(d => (
                  <div key={d.label} className={styles.cardDetail}>
                    <span className={styles.detailLabel}>{d.label}</span>
                    <span className={styles.detailVal}>{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Apply modal */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Apply for {job.title}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleApply} className={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Cover letter <span style={{color:'var(--text-muted)',textTransform:'none',fontWeight:400}}>(optional)</span></label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder={`Why are you a great fit for this ${job.title} role?`}
                  value={form.coverLetter}
                  onChange={e => setForm(f => ({ ...f, coverLetter: e.target.value }))}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Your profile and resume from your account will be shared with the employer.
              </p>
              <div className={styles.modalActions}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? <span className="spinner" /> : 'Submit application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
