import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createJob } from '../store/slices/jobSlice'
import toast from 'react-hot-toast'
import styles from './PostJob.module.css'

const INITIAL = {
  title: '', description: '', location: '', type: 'full-time',
  requirements: '', deadline: '',
  salary: { min: '', max: '', currency: '₹' },
}

export default function PostJob() {
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setSalary = (key, val) => setForm(f => ({ ...f, salary: { ...f.salary, [key]: val } }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      ...form,
      requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean),
      salary: {
        min: Number(form.salary.min) || 0,
        max: Number(form.salary.max) || 0,
        currency: form.salary.currency,
      },
    }
    const res = await dispatch(createJob(payload))
    setLoading(false)
    if (!res.error) {
      toast.success('Job posted successfully!')
      navigate('/employer/dashboard')
    } else {
      toast.error(res.payload || 'Failed to post job')
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className={styles.header}>
          <h1>Post a job</h1>
          <p>Reach thousands of qualified candidates on Hired</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Job details</h3>
            <div className={styles.grid2}>
              <div className="form-group">
                <label className="form-label">Job title *</label>
                <input className="form-input" required placeholder="e.g. Senior React Developer" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Job type *</label>
                <select className="form-input form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                  {['full-time','part-time','remote','internship'].map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" required placeholder="e.g. Bangalore, Remote" value={form.location} onChange={e => set('location', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Application deadline</label>
                <input type="date" className="form-input" value={form.deadline} onChange={e => set('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Salary range</h3>
            <div className={styles.grid3}>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select className="form-input form-select" value={form.salary.currency} onChange={e => setSalary('currency', e.target.value)}>
                  {['₹','$','€','£'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Minimum (per year)</label>
                <input type="number" className="form-input" placeholder="e.g. 600000" value={form.salary.min} onChange={e => setSalary('min', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Maximum (per year)</label>
                <input type="number" className="form-input" placeholder="e.g. 1200000" value={form.salary.max} onChange={e => setSalary('max', e.target.value)} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Job description *</h3>
            <div className="form-group">
              <textarea
                className="form-input"
                required rows={8}
                placeholder="Describe the role, responsibilities, what a typical day looks like, team culture..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Required skills</h3>
            <div className="form-group">
              <label className="form-label">Skills (comma-separated)</label>
              <input
                className="form-input"
                placeholder="e.g. React, Node.js, MongoDB, REST APIs"
                value={form.requirements}
                onChange={e => set('requirements', e.target.value)}
              />
              {form.requirements && (
                <div className={styles.skillPreview}>
                  {form.requirements.split(',').map(r => r.trim()).filter(Boolean).map(r => (
                    <span key={r} className="badge badge-default">{r}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Publish job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
