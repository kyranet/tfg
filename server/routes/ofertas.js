// ruta: /api/ofertas

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('./../middlewares/validar-campos');
const {getAreasServicio, crearOferta, obtenerOferta, obtenerOfertas, getOfertasAreaServicio} = require('../controllers/ofertas');
const {opcionalJWT, validarJWT, validarEsProfesorOrEsGestor} = require('../middlewares/validar-jwt');

const router = Router();


router.get('/', [], obtenerOfertas);

//Obtener universidades
router.get(
    '/areasservicio', [],
    getAreasServicio
);

// Obtener las ofertas que contienen un determinado area de servicio
router.get(
    '/ofertasAreaServicio/:id', [],
    getOfertasAreaServicio
)

router.get(
    '/ofertasAreaServicio/:id', [],
    getOfertasAreaServicio
)

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
        validarCampos,
    ],
    crearOferta
);

// obtener una oferta
router.get(
    '/:id', [validarJWT],
    obtenerOferta
);
module.exports = router;
