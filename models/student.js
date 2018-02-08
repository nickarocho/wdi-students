var mongoose = require('mongoose');

// The factSchema is used to embedded subdocs in a student doc.
// There is no model and no 'facts' collection
var factSchema = new mongoose.Schema({
  text: String,
  created: { type: Date, default: Date.now }
});

var studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  cohort: Number,
  avatar: String,
  facts: [factSchema],
  googleId: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
