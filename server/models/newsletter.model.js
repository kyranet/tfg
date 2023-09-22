const { Schema, model } = require('mongoose');

const NewsletterSchema = new Schema({

  mail_to: {
    type: String,
    required: true,
    unique: true
  },

  usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false
  },

}, { timestamps: true });


module.exports = model('Newsletter', NewsletterSchema);