// ruta: /api/ofertas

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { getAreasservicio, crearOferta, obtenerOferta} = require('../controllers/ofertas');
const { opcionalJWT, validarJWT, validarEsProfesorOrEsGestor } = require('../middlewares/validar-jwt');

const router = Router();

//Obtener universidades
router.get(
    '/areasservicio',[],
    getAreasservicio
);

// crear iniciativa, profesor, socio o gestor
router.post(
    '/',
    [
        validarJWT,
        validarEsProfesorOrEsGestor,
        check('titulo', 'El título es un campo obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es un campo obligatorio').not().isEmpty(),
        check('creador', 'El creador es un campo obligatorio').not().isEmpty(),
        check('area_servicio', 'El area_servicio es un campo obligatorio').not().isEmpty(),
        check('asignatura', 'El asignatura es un campo obligatorio').not().isEmpty(),
        check('fecha_limite', 'El fecha_limite es un campo obligatorio').not().isEmpty(),
        check('cuatrimestre', 'El cuatrimestre es un campo obligatorio').not().isEmpty(),
        check('anio_academico', 'El anio_academico es un campo obligatorio').not().isEmpty(),
        validarCampos,
    ],
    crearOferta
);

// obtener una iniciativa
router.get(
    '/:id', [],
    obtenerOferta
);
module.exports = router;