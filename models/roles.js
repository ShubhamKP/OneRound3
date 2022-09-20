let mongoose = require('mongoose')

let roleSchema = mongoose.Schema({
  roleName: {
    type: String,
    required: true
  },
  permissions: {
    type: Object,
    required: true
  }
})

exports.roles = mongoose.model('role', roleSchema)