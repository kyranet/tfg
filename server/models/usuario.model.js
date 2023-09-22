const { Schema, model } = require('mongoose');

const { ROLES, ROL_ESTUDIANTE } = require('./rol.model');

const UsuarioSchema = new Schema({

  email: {
    type: String,
    unique: true,
    required: true
  },

  nombre: {
    type: String,
    required: true
  },

  apellidos: {
    type: String,
    required: false
  },

  facultad: {
    type: String,
    required: false
  },

  areaConocimiento: {
    type: Array,
    required: false
  },

  password: {
    type: String,
    required: true
  },

  universidad: {
    type: String,
    required: false
  },

  // para estudiantes, para profesores se guardará la facultad/escuela en este campo
  titulacion: {
    type: String,
    required: false
  },

  // para socios comunitarios
  sector: {
    type: String,
    required: false
  },

  url: {
    type: String,
    required: false
  },

  mision: {
    type: String,
    required: false
  },

  nombreSocioComunitario: {
    type: String,
    required: false
  },

  terminos_aceptados: {
    type: Boolean,
    required: false
  },
  telefono: {
    type: Number,
    required: true
  },
  origin_login: {
    type: String,
    default: "Portal ApS"
  },

  origin_img: {
    type: String,
    required: false
  },

  rol: {
    type: String,
    required: true,
    default: ROL_ESTUDIANTE,
    enum: {
      values: ROLES,
      message: 'El rol {VALUE} no es un valor válido'
    }
  }

}, { timestamps: true });

UsuarioSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});


module.exports = model('Usuario', UsuarioSchema);