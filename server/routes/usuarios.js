// ruta: /api/usuarios

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { obtenerProfesores} = require('../controllers/usuarios');
const { getUsuarios, getUsuario, crearUsuario, actualizarUsuario, borrarUsuario } = require('./../controllers/usuarios');
const { opcionalJWT, validarJWT, validarEsGestor } = require('../middlewares/validar-jwt');

const router = Router();

// listar usuarios, solo gestor
router.get('/', [validarJWT, validarEsGestor], getUsuarios);

//Obtener universidades
router.get(
    '/profesores',[],
    obtenerProfesores
);

// obtener un usuario, solo gestor
router.get(
    '/:uid', [
        check('uid', 'El id del usuario debe ser válido').isMongoId(),
        validarJWT,
        validarEsGestor,
        validarCampos
    ],
    getUsuario
);

// crear usuario, cualquiera (registro) - para crear gestor se debe ser gestor
router.post(
    '/',
    [
        check('email', 'El email es un campo obligatorio').isEmail(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        check('password','La contraseña es obligatoria').not().isEmpty(),
        validarCampos,
        opcionalJWT,
    ],
    crearUsuario
);

// actualizar usuario, solo gestor o usuario propio
router.put(
    '/:id',
    [
        validarJWT,
        check('email', 'El email es un campo obligatorio').not().isEmpty(),
        check('email', 'El email debe ser un correo electrónico válido').isEmail(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        check('rol','El rol es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarUsuario
);

// borrar usuarios, solo gestor y no ser uno mismo
router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;