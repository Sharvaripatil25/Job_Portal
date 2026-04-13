const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  website:     { type: String, default: '' },
  logo:        { type: String, default: '' },
  location:    { type: String, default: '' },
  industry:    { type: String, default: '' },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Company', companySchema)