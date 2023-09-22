// ruta: /api/proyectos

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { getProyectos, getProyecto, cambiarEstadoProyecto, enviarMensajeProyecto } = require('./../controllers/proyectos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// listar proyectos
router.get('/', [], getProyectos);

// obtener un proyecto
router.get(
    '/:id', [
        validarJWT,
        check('id', 'El id del proyecto debe ser válido').isMongoId(),
        validarCampos
    ],
    getProyecto
);

// modificar estado
router.put(
    '/modificar-estado/:id', [
        validarJWT,
        check('id', 'El id del proyecto debe ser válido').isMongoId(),
        validarCampos
    ],
    cambiarEstadoProyecto
);


// modificar estado
router.post(
    '/enviar-mensaje/:id', [
        validarJWT,
        check('id', 'El id del proyecto debe ser válido').isMongoId(),
        validarCampos
    ],
    enviarMensajeProyecto
);


module.exports = router;