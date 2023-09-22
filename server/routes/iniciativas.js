// ruta: /api/iniciativas

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { getIniciativas, getIniciativa, respaldarIniciativa, crearIniciativa, actualizarIniciativa, archivarIniciativa, desarchivarIniciativa } = require('./../controllers/iniciativas');
const { opcionalJWT, validarJWT, validarEsProfesorOrSocioComunitarioOrEsGestor, validarEsGestor } = require('../middlewares/validar-jwt');

const router = Router();

// listar iniciativas, todos
router.get('/', [], getIniciativas);

// obtener una iniciativa
router.get(
    '/:id', [
        check('id', 'El id de la iniciativa debe ser válido').isMongoId(),
        validarCampos
    ],
    getIniciativa
);

router.put(
    '/respaldar/:id', [
        opcionalJWT,
        check('id', 'El id de la iniciativa debe ser válido').isMongoId(),
        validarCampos,
    ],
    respaldarIniciativa
);


// crear iniciativa, profesor, socio o gestor
router.post(
    '/',
    [
        validarJWT,
        validarEsProfesorOrSocioComunitarioOrEsGestor,
        check('titulo', 'El título es un campo obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es un campo obligatorio').not().isEmpty(),
        check('rama', 'El rama es un campo obligatorio').not().isEmpty(),
        check('ciudad', 'La ciudad es un campo obligatorio').not().isEmpty(),
        check('proponedor', 'El proponedor es un campo obligatorio').not().isEmpty(),
        validarCampos,
    ],
    crearIniciativa
);


// actualizar iniciativa, solo gestor o proponedor
router.put(
    '/:id',
    [
        validarJWT,
        validarEsProfesorOrSocioComunitarioOrEsGestor,
        check('titulo', 'El título es un campo obligatorio').not().isEmpty(),
        check('descripcion', 'La descripción es un campo obligatorio').not().isEmpty(),
        check('rama', 'El rama es un campo obligatorio').not().isEmpty(),
        check('ciudad', 'La ciudad es un campo obligatorio').not().isEmpty(),
        check('proponedor', 'El proponedor es un campo obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarIniciativa
);

// borrar (archivar) iniciativas, solo gestor o proponedor
router.delete('/:id',
    [
        validarJWT,
        validarEsProfesorOrSocioComunitarioOrEsGestor,
    ],
    archivarIniciativa
);

// borrar (archivar) iniciativas, solo gestor o proponedor
router.put('/reabrir/:id',
    [
        validarJWT,
        validarEsGestor,
    ],
    desarchivarIniciativa
);


module.exports = router;