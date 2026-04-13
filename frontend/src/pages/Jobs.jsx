import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs, setFilters } from '../store/slices/jobSlice'
import JobCard from '../components/common/JobCard'
import styles from './Jobs.module.css'

const JOB_TYPES = ['', 'full-time', 'part-time', 'remote', 'internship']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'salary', label: 'Highest salary' },
]

export default function Jobs() {
  const dispatch = useDispatch()
  const { list, total, pages, loading, filters } = useSelector(s => s.jobs)
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const [localLocation, setLocalLocation] = useState(filters.location || '')

  useEffect(() => {
    dispatch(fetchJobs(filters))
  }, [filters])

  const applySearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search: localSearch, location: localLocation, page: 1 }))
  }

  const changeType = (type) => dispatch(setFilters({ type, page: 1 }))
  const changePage = (p) => dispatch(setFilters({ page: p }))

  const SkeletonCard = () => (
    <div className={styles.skeleton}>
      <div className={styles.skelTop} />
      <div className={styles.skelTitle} />
      <div className={styles.skelRow} />
      <div className={styles.skelTags} />
    </div>
  )

  return (
    <div className="page">
      <div className="container">
        {/* Search bar */}
        <form className={styles.searchBar} onSubmit={applySearch}>
          <div className={styles.searchField}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by title, skill, or company..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
            />
          </div>
          <div className={styles.searchField}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
              <path d="M8 2C5.79 2 4 3.79 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 8 4a1.5 1.5 0 0 1 0 3.5z" fill="currentColor" fillOpacity=".5"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Location or remote"
              value={localLocation}
              onChange={e => setLocalLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className={styles.layout}>
          {/* Sidebar filters */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Job type</h4>
              {JOB_TYPES.map(t => (
                <label key={t} className={styles.filterOption}>
                  <input
                    type="radio" name="type"
                    checked={filters.type === t}
                    onChange={() => changeType(t)}
                  />
                  <span>{t === '' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}</span>
                </label>
              ))}
            </div>

            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Sort by</h4>
              {SORT_OPTIONS.map(o => (
                <label key={o.value} className={styles.filterOption}>
                  <input
                    type="radio" name="sort"
                    checked={(filters.sort || 'newest') === o.value}
                    onChange={() => dispatch(setFilters({ sort: o.value, page: 1 }))}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Job list */}
          <main className={styles.main}>
            <div className={styles.resultsHeader}>
              <p className={styles.resultCount}>
                {loading ? 'Loading…' : `${total} job${total !== 1 ? 's' : ''} found`}
              </p>
              {filters.search && (
                <button
                  className={styles.clearBtn}
                  onClick={() => {
                    setLocalSearch('')
                    setLocalLocation('')
                    dispatch(setFilters({ search: '', location: '', type: '', page: 1 }))
                  }}
                >
                  Clear filters ×
                </button>
              )}
            </div>

            <div className={styles.jobGrid}>
              {loading
                ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                : list.length === 0
                  ? (
                    <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                      <h3>No jobs found</h3>
                      <p>Try adjusting your search or filters</p>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setLocalSearch(''); setLocalLocation('')
                          dispatch(setFilters({ search: '', location: '', type: '', page: 1 }))
                        }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  )
                  : list.map((job, i) => (
                    <div key={job._id} style={{ animationDelay: `${i * 0.04}s` }} className="animate-fadeUp">
                      <JobCard job={job} />
                    </div>
                  ))
              }
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className={styles.pagination}>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={filters.page === 1}
                  onClick={() => changePage(filters.page - 1)}
                >
                  ← Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`${styles.pageBtn} ${filters.page === p ? styles.pageActive : ''}`}
                    onClick={() => changePage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={filters.page === pages}
                  onClick={() => changePage(filters.page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
