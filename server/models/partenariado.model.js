const { Schema, model } = require('mongoose');

const PartenariadoSchema = new Schema({

  estado: {
    type: String,
    required: true
  },

  titulo: {
    type: String,
    required: true
  },

  descripcion: {
    type: String,
    required: true
  },

  rama: {
    type: String,
    required: true
  },

  ciudad: {
    type: String,
    required: true
  },

  iniciativa: {
      type: Schema.Types.ObjectId,
      ref: 'Iniciativa',
      required: true
  },

  proyecto: {
      type: Schema.Types.ObjectId,
      ref: 'Proyecto',
  },

  profesores: [{
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
  }],


  sociosComunitarios: [{
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
  }],

  mensajes: {
    type: Schema.Types.Mixed,
  },

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

PartenariadoSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
});


module.exports = model('Partenariado', PartenariadoSchema);