import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, loading } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name: user?.name || '',
    profile: {
      bio: user?.profile?.bio || '',
      skills: user?.profile?.skills?.join(', ') || '',
      resumeUrl: user?.profile?.resumeUrl || '',
    },
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setProfile = (key, val) => setForm(f => ({ ...f, profile: { ...f.profile, [key]: val } }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      profile: {
        ...form.profile,
        skills: form.profile.skills.split(',').map(s => s.trim()).filter(Boolean),
      },
    }
    const res = await dispatch(updateProfile(payload))
    if (!res.error) toast.success('Profile updated!')
    else toast.error(res.payload || 'Update failed')
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My profile</h1>
          <p>Keep your profile updated to get better job matches.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.avatarCard}>
            <div className={styles.avatarCircle}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className={`badge badge-gold ${styles.roleBadge}`}>{user?.role}</span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Personal info</h3>
              <div className={styles.grid2}>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
                </div>
              </div>
            </div>

            {user?.role === 'seeker' && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Professional details</h3>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Bio / headline</label>
                  <textarea
                    className="form-input" rows={3}
                    placeholder="e.g. Full-stack developer with 4 years building React & Node.js applications"
                    value={form.profile.bio}
                    onChange={e => setProfile('bio', e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Skills (comma-separated)</label>
                  <input
                    className="form-input"
                    placeholder="React, Node.js, MongoDB, Docker"
                    value={form.profile.skills}
                    onChange={e => setProfile('skills', e.target.value)}
                  />
                  {form.profile.skills && (
                    <div className={styles.skillPreview}>
                      {form.profile.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                        <span key={s} className="badge badge-default">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Resume URL</label>
                  <input
                    type="url" className="form-input"
                    placeholder="https://drive.google.com/..."
                    value={form.profile.resumeUrl}
                    onChange={e => setProfile('resumeUrl', e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
