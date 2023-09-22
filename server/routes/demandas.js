const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { getAreasservicio, crearDemanda, getTitulaciones, getNecesidades, obtenerDemanda, obtenerDemandas, getDemandasAreaServicio, getDemandasNecesidadSocial } = require('../controllers/demandas');
const { opcionalJWT, validarJWT, validarEsSocioComunitarioOrEsGestor } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], obtenerDemandas);

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
    '/:id', [validarJWT],
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
        check('objetivo', 'El objetivo es un campo obligatorio').not().isEmpty(),
        check('necesidad_social', 'La necesidad social es un campo obligatorio').not().isEmpty(),
        check('comunidadBeneficiaria', 'La comunidad beneficiaria es un campo obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearDemanda
);

module.exports = router;
