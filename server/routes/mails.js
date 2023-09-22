// ruta: /api/usuarios

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { getMails, getNewsletters, crearRegistroMail, suscribirNewsletter } = require('./../controllers/mails');
const { opcionalJWT, validarJWT, validarEsGestor } = require('../middlewares/validar-jwt');

const router = Router();

// listar mails, solo gestor
router.get('/', [validarJWT, validarEsGestor], getMails);

// listar newsdletters
router.get('/newsletters', [validarJWT, validarEsGestor], getNewsletters);


// enviar email de contacto
router.post(
    '/contacto',
    [
        check('subject', 'El asunto es obligatorio').not().isEmpty(),
        check('html', 'El contenido del mensaje es obligatorio').not().isEmpty(),
        validarCampos,
        opcionalJWT,
    ],
    crearRegistroMail
);

// enviar email de contacto
router.post(
    '/suscribir-newsletter',
    [
        check('mail_to', 'El email al que enviar debe ser un email válido').isEmail(),
        check('mail_to', 'El email al que enviar es un campo obligatorio').not().isEmpty(),
        validarCampos,
        opcionalJWT,
    ],
    suscribirNewsletter
);



// enviar email de alertas al usuario
/*
router.post(
    '/alerta',
    [
        check('to', 'El email al que enviar debe ser un email válido').isEmail(),
        check('to', 'El email al que enviar es un campo obligatorio').not().isEmpty(),
        check('type','El tipo de mensaje es obligatorio').not().isEmpty(),
        check('subject', 'El asunto es obligatorio').not().isEmpty(),
        check('html', 'El contenido del mensahe es obligatorios').not().isEmpty(),
        validarCampos,
        opcionalJWT,
    ],
    crearRegistroMail
);
*/

module.exports = router;