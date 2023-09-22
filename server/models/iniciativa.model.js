const { Schema, model } = require('mongoose');

const IniciativaSchema = new Schema({

  estado: {
    type: String,
    required: true,
  },

  titulo: {
    type: String,
    required: true,
    unique: true,
  },

  descripcion: {
    type: String,
    required: true
  },

  imagen: {
    type: String,
    required: false
  },

  rama: {
    type: String,
    required: true
  },

  ciudad: {
    type: String,
    required: true
  },

  partenariados: [{
      type: Schema.Types.ObjectId,
      ref: 'Partenariado',
  }],

  archivos: [{
      type: Schema.Types.ObjectId,
      ref: 'Upload',
  }],

  proponedor: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
  },

  // puede ser creado por el gestor, y que este asigne un proponedor
  creador: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
  },

}, { timestamps: true });

IniciativaSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
});


module.exports = model('Iniciativa', IniciativaSchema);