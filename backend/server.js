const express    = require('express')
const cors       = require('cors')
const rateLimit  = require('express-rate-limit')
require('dotenv').config()

const connectDB      = require('./db')
const errorHandler   = require('./middleware/errorHandler')

const app = express()

// Connect database
connectDB()

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting on auth routes only
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { message: 'Too many requests, please try again later.' },
}))

// ── Routes ──
app.use('/api/auth',         require('./routes/auth'))
app.use('/api/jobs',         require('./routes/jobs'))
app.use('/api/applications', require('./routes/applications'))
app.use('/api/users',        require('./routes/users'))
app.use('/api/admin',        require('./routes/admin'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }))

// Handle unhandled routes (404)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅  Server running → http://localhost:${PORT}`)
})