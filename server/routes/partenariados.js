// ruta: /api/partenariados

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { crearPartenariadoProfesor, crearPartenariadoSocioComunitario, getPartenariados, getPartenariado, actualizarPartenariado, cambiarEstadoPartenariado } = require('../controllers/partenariados');
const { validarJWT, validarEsProfesor, validarEsSocioComunitario } = require('../middlewares/validar-jwt');

const router = Router();

// crear partenariado_profesor
router.post(
    '/crearProfesor',
    [
        validarJWT,
        //validarEsProfesor,
        check('titulo', 'El titulo es un campo obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
        // check('responsable', 'El responsable es un campo obligatorio').not().isEmpty(),
        check('profesores', 'Los profesores es un campo obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearPartenariadoProfesor
);

router.post(
    '/crearSocioComunitario',
    [
        validarJWT,
        validarEsSocioComunitario,
        check('id_oferta', 'El id_demanda es un campo obligatorio').not().isEmpty(),
        check('titulo', 'El titulo es un campo obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
        // check('area_servicio', 'El area de servicio es un campo obligatorio').not().isEmpty(),
        // check('externos', 'El campo externos es un campo obligatorio').not().isEmpty(),
        // check('responsable', 'El responsable es un campo obligatorio').not().isEmpty(),
        // check('profesores', 'Los profesores es un campo obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearPartenariadoSocioComunitario
);

router.post(
    '/actualizar/:id',
    [
        validarJWT,
        check('titulo', 'El titulo es un campo obligatorio').not().isEmpty(),
        check('titulo', 'El titulo es un campo obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es un campo obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarPartenariado
);
// listar partenariados
router.get('/', [validarJWT],
    getPartenariados);

// obtener un partenariado
router.get(
    '/:id', [
        validarJWT,
        // validarEsProfesorOrSocioComunitarioOrEsGestor,
        //check('id', 'El id del partenariado debe ser válido').isMongoId(),
        // validarCampos
    ],
    getPartenariado
);

// // modificar estado
router.put(
    '/modificar-estado/:id', [
        validarJWT,
        //validarEsProfesorOrSocioComunitarioOrEsGestor,
        //check('id', 'El id del partenariado debe ser válido').isMongoId(),
        //validarCampos
    ],
    cambiarEstadoPartenariado
);


// // modificar estado
// router.post(
//     '/enviar-mensaje/:id', [
//         validarJWT,
//         validarEsProfesorOrSocioComunitarioOrEsGestor,
//         check('id', 'El id del partenariado debe ser válido').isMongoId(),
//         validarCampos
//     ],
//     enviarMensajePartenariado
// );


module.exports = router;
