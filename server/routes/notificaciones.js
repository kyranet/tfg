
const {Router} = require('express');
const {obtenerNotificaciones, obtenerNotificacion, crearNotificacionOfertaAceptada, rechazarSocio, aceptarSocio, notificarPartenariadoCreado, notificacionDemandaRespaldado } = require('../controllers/notificaciones');
const { validarJWT, validarEsProfesor, validarEsSocioComunitario } = require('../middlewares/validar-jwt');


const router = Router();


router.get('/',[validarJWT], obtenerNotificaciones);

router.get('/ver/:id',[validarJWT], obtenerNotificacion);

router.get('/crearOfertaAceptada',[validarJWT], crearNotificacionOfertaAceptada);

router.get('/respuesta/aceptar',[validarJWT], aceptarSocio);

router.get('/respuesta/rechazar',[validarJWT], rechazarSocio);

router.get('/partenariadohecho',[validarJWT], notificarPartenariadoCreado);

router.post('/respaldarDemanda',[validarJWT], notificacionDemandaRespaldado);


module.exports = router;