const { Schema, model } = require('mongoose');

const MailSchema = new Schema({

  type: {
    type: String,
    required: true
  },

  mail_from: {
    type: String,
    required: true
  },

  mail_name: {
    type: String,
    required: true
  },

  to: {
    type: String,
    required: false
  },

  subject: {
    type: String,
    required: true
  },

  html: {
    type: String,
    required: false
  },

  usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false
  },

}, { timestamps: true });


module.exports = model('Mail', MailSchema);