const { Schema, model } = require('mongoose');

const UploadSchema = new Schema({
  almacenamiento: {
    type: String,
    required: true
  },

  tipo: {
    type: String,
    required: true
  },

  tipo_id: {
    type: String,
    required: true
  },

  campo: {
    type: String,
    required: true,
  },

  path: {
    type: String,
    required: true
  },

  nombre: {
    type: String,
    required: true
  },

  client_name: {
    type: String,
    required: true
  },

  creador: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
  },

}, { timestamps: true });

UploadSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
});


module.exports = model('Upload', UploadSchema);