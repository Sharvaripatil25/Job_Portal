import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axiosInstance'
import toast from 'react-hot-toast'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const { user } = useSelector(s => s.auth)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes, jobsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/jobs'),
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data.users)
        setJobs(jobsRes.data.jobs)
      } catch (err) {
        toast.error('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleUserStatus = async (id, isSuspended) => {
    try {
      await api.patch(`/admin/users/${id}/suspend`, { suspend: !isSuspended })
      setUsers(us => us.map(u => u._id === id ? { ...u, suspended: !isSuspended } : u))
      toast.success(isSuspended ? 'User reinstated' : 'User suspended')
    } catch { toast.error('Action failed') }
  }

  const toggleJobStatus = async (id, isActive) => {
    try {
      await api.patch(`/admin/jobs/${id}/toggle`)
      setJobs(js => js.map(j => j._id === id ? { ...j, isActive: !isActive } : j))
      toast.success(isActive ? 'Job deactivated' : 'Job activated')
    } catch { toast.error('Action failed') }
  }

  if (loading) return (
    <div className="page"><div className="container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Array(4).fill(0).map((_, i) => <div key={i} style={{ height: 80, background: 'var(--paper-2)', borderRadius: 'var(--radius-lg)', animation: 'shimmer 1.4s ease infinite' }} />)}
      </div>
    </div></div>
  )

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Admin panel</h1>
          <p>Platform overview and management tools.</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className={styles.statsGrid}>
            {[
              { label: 'Total users', val: stats.totalUsers, icon: '👥' },
              { label: 'Active jobs', val: stats.activeJobs, icon: '📋' },
              { label: 'Applications', val: stats.totalApplications, icon: '📨' },
              { label: 'Employers', val: stats.totalEmployers, icon: '🏢' },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statIcon}>{s.icon}</span>
                <span className={styles.statVal}>{s.val ?? '—'}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="tab-nav">
          {['overview', 'users', 'jobs'].map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <h3>Recent users</h3>
              {users.slice(0, 5).map(u => (
                <div key={u._id} className={styles.miniRow}>
                  <div className={styles.miniAvatar}>{u.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <p className={styles.miniName}>{u.name}</p>
                    <p className={styles.miniSub}>{u.role} · {u.email}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.overviewCard}>
              <h3>Recent jobs</h3>
              {jobs.slice(0, 5).map(j => (
                <div key={j._id} className={styles.miniRow}>
                  <div className={styles.miniIcon}>📋</div>
                  <div>
                    <p className={styles.miniName}>{j.title}</p>
                    <p className={styles.miniSub}>{j.company?.name} · {j.location}</p>
                  </div>
                  <span className={`badge ${j.isActive ? 'badge-green' : 'badge-default'}`}>{j.isActive ? 'Active' : 'Off'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>User</span><span>Role</span><span>Joined</span><span>Status</span><span>Action</span>
            </div>
            {users.map(u => (
              <div key={u._id} className={styles.tableRow}>
                <div className={styles.userCell}>
                  <div className={styles.miniAvatar}>{u.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <p className={styles.miniName}>{u.name}</p>
                    <p className={styles.miniSub}>{u.email}</p>
                  </div>
                </div>
                <span className={`badge ${u.role === 'employer' ? 'badge-blue' : u.role === 'admin' ? 'badge-gold' : 'badge-default'}`}>{u.role}</span>
                <span className={styles.dateCell}>{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className={`badge ${u.suspended ? 'badge-red' : 'badge-green'}`}>{u.suspended ? 'Suspended' : 'Active'}</span>
                {u.role !== 'admin' && (
                  <button
                    className={`btn btn-sm ${u.suspended ? '' : styles.dangerBtn}`}
                    onClick={() => toggleUserStatus(u._id, u.suspended)}
                  >
                    {u.suspended ? 'Reinstate' : 'Suspend'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Job</span><span>Company</span><span>Type</span><span>Status</span><span>Action</span>
            </div>
            {jobs.map(j => (
              <div key={j._id} className={styles.tableRow}>
                <div>
                  <p className={styles.miniName}>{j.title}</p>
                  <p className={styles.miniSub}>{j.location}</p>
                </div>
                <span className={styles.miniSub}>{j.company?.name}</span>
                <span className="badge badge-default" style={{ textTransform: 'capitalize' }}>{j.type}</span>
                <span className={`badge ${j.isActive ? 'badge-green' : 'badge-default'}`}>{j.isActive ? 'Active' : 'Inactive'}</span>
                <button className={`btn btn-sm btn-ghost`} onClick={() => toggleJobStatus(j._id, j.isActive)}>
                  {j.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
