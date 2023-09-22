// ruta: /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { login, loginUNED, loginGoogle, renewToken } = require('./../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
    '/login',
    [
        check('email', 'El email es un campo obligatorio').isEmail(),
        check('password','La contraseña es obligatoria').not().isEmpty(),
        validarCampos,
    ],
    login
);

router.post(
    '/login/uned',
    [
        check('email', 'El email es un campo obligatorio').isEmail(),
        check('password','La contraseña es obligatoria').not().isEmpty(),
        validarCampos,
    ],
    loginUNED
);


router.post(
    '/login/google',
    [
        check('token','El token de Google es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    loginGoogle
);

router.get('/renewToken', validarJWT, renewToken);

module.exports = router;