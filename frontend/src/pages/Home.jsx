import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setFilters } from '../store/slices/jobSlice'
import styles from './Home.module.css'

const CATEGORIES = [
  { label: 'Engineering', icon: '⚙️', count: '2.4k' },
  { label: 'Design',      icon: '🎨', count: '890'  },
  { label: 'Marketing',   icon: '📣', count: '1.2k' },
  { label: 'Finance',     icon: '📊', count: '760'  },
  { label: 'Product',     icon: '🚀', count: '430'  },
  { label: 'Remote',      icon: '🌍', count: '3.1k' },
]

const STATS = [
  { value: '12,000+', label: 'Active jobs' },
  { value: '4,200+',  label: 'Companies hiring' },
  { value: '98k+',    label: 'Candidates placed' },
]

const STEPS = [
  { num: '01', title: 'Create your profile', desc: 'Sign up in under 2 minutes. Add your skills, experience, and resume link.' },
  { num: '02', title: 'Browse & apply',       desc: 'Search thousands of verified roles. Apply with one click using your saved profile.' },
  { num: '03', title: 'Get hired',            desc: 'Track every application in your dashboard. Hear back faster from employers.' },
]

export default function Home() {
  const [search, setSearch]     = useState('')
  const [location, setLocation] = useState('')
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search, location, page: 1 }))
    navigate('/jobs')
  }

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>

          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <span className={styles.dot} />
              Now hiring across 40+ categories
            </div>

            <h1 className={styles.heroTitle}>
              Find work that<br />
              <em>moves you forward.</em>
            </h1>

            <p className={styles.heroSub}>
              Thousands of roles from companies worth working for.
              Curated, transparent, no noise.
            </p>

            <form className={styles.searchBar} onSubmit={handleSearch}>
              <div className={styles.searchField}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text" placeholder="Job title or keyword"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.searchDivider} />
              <div className={styles.searchField}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C5.79 2 4 3.79 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 8 4a1.5 1.5 0 0 1 0 3.5z" fill="currentColor" fillOpacity=".5"/>
                </svg>
                <input
                  type="text" placeholder="City or remote"
                  value={location} onChange={e => setLocation(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
                Search jobs
              </button>
            </form>

            <div className={styles.stats}>
              {STATS.map(s => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statVal}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — stacked cards, no absolute positioning */}
          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.visualHeader}>
                <div className={styles.visualDots}><span/><span/><span/></div>
                <span className={styles.visualTitle}>New match</span>
              </div>
              <div className={styles.jobPreview}>
                <div className={styles.previewLogo}>S</div>
                <div>
                  <p className={styles.previewTitle}>Senior Product Designer</p>
                  <p className={styles.previewMeta}>Stripe · Remote · ₹42–58L</p>
                </div>
              </div>
              <div className={styles.matchBar}>
                <span className={styles.matchLabel}>Profile match</span>
                <span className={styles.matchScore}>92%</span>
              </div>
              <div className={styles.matchTrack}>
                <div className={styles.matchFill} style={{ width: '92%' }} />
              </div>
              <div className={styles.previewTags}>
                <span className="badge badge-gold">Figma</span>
                <span className="badge badge-default">Design systems</span>
                <span className="badge badge-default">React</span>
              </div>
            </div>

            {/* Notification below — no overlap */}
            <div className={styles.visualCard2}>
              <p className={styles.notifText}>🎉 Hired today</p>
              <p className={styles.notifName}>Sneha M. — UX Lead at Razorpay</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Categories ── */}
      <section className={styles.categories}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Browse by category</h2>
          <p className={styles.sectionSub}>Explore opportunities across every industry</p>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                className={styles.categoryCard}
                onClick={() => {
                  dispatch(setFilters({ search: cat.label, page: 1 }))
                  navigate('/jobs')
                }}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span className={styles.categoryLabel}>{cat.label}</span>
                <span className={styles.categoryCount}>{cat.count} jobs</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.howItWorks}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How Hired works</h2>
          <p className={styles.sectionSub}>Three simple steps from signup to your next role</p>
          <div className={styles.stepsGrid}>
            {STEPS.map(s => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaText}>
              <h2>Hiring great people?</h2>
              <p>Post your roles and reach thousands of qualified candidates today.</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link to="/register" className="btn btn-gold btn-lg">
                Post a job
              </Link>
              {/* Custom ghost button that's visible on dark bg */}
              <Link to="/jobs" className={styles.ctaGhostBtn}>
                Browse talent
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
