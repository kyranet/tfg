const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { getAreasservicio, crearDemanda, getTitulaciones, getNecesidades, obtenerDemanda, obtenerDemandas, getDemandasAreaServicio, getDemandasNecesidadSocial } = require('../controllers/demandas');
const { opcionalJWT, validarJWT, validarEsSocioComunitarioOrEsGestor } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [], obtenerDemandas);

// Obtener areas de servicio
router.get(
    '/areasservicio', [],
    getAreasservicio
);

// Obtener necesidades sociales
router.get(
    '/necesidadsocial', [],
    getNecesidades
);

// Obtener las demandas que contienen una determinada area de servicio
router.get(
    '/demandasAreaServicio/:id', [],
    getDemandasAreaServicio
);

// Obtener las demandas que contienen una determinada necesidad social
router.get(
    '/demandasNecesidadSocial/:id', [],
    getDemandasNecesidadSocial
);

// Obtener titulaciones locales
router.get(
    '/titulacionlocal', [],
    getTitulaciones
);

router.get(
    '/:id', [],
    obtenerDemanda
);

// crear iniciativa, profesor, socio o gestor
router.post(
    '/',
    [
        validarJWT,
        validarEsSocioComunitarioOrEsGestor,
        check('titulo', 'El título es un campo obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es un campo obligatorio').not().isEmpty(),
        check('area_servicio', 'El area_servicio es un campo obligatorio').not().isEmpty(),
        check('ciudad', 'La ciudad es un campo obligatorio').not().isEmpty(),
        check('objetivo', 'El objetivo es un campo obligatorio').not().isEmpty(),
        check('fechaDefinicionIni', 'La fecha de comienzo del periodo de definicion es un campo obligatorio').not().isEmpty(),
        check('fechaDefinicionFin', 'La fecha de final del periodo de definicion es un campo obligatorio').not().isEmpty(),
        check('fechaEjecucionIni', 'La fecha de comienzo del periodo de ejecucion es un campo obligatorio').not().isEmpty(),
        check('fechaEjecucionFin', 'La fecha de final del periodo de ejecucion es un campo obligatorio').not().isEmpty(),
        check('fechaFin', 'La fecha de fin es un campo obligatorio').not().isEmpty(),
        check('necesidad_social', 'La necesidad social es un campo obligatorio').not().isEmpty(),
        check('comunidadBeneficiaria', 'La comunidad beneficiaria es un campo obligatorio').not().isEmpty(),
        check('titulacion_local', 'La titulacion local es un campo obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearDemanda
);

module.exports = router;
