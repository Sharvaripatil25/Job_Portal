const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:      { type: String, required: [true, 'Name is required'], trim: true },
  email:     { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password:  { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role:      { type: String, enum: ['seeker', 'employer', 'admin'], default: 'seeker' },
  suspended: { type: Boolean, default: false },
  profile: {
    bio:          { type: String, default: '' },
    skills:       [{ type: String }],
    resumeUrl:    { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Compare password helper
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

module.exports = mongoose.model('User', userSchema)