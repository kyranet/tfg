// ruta: /api/home

const { Router } = require('express');
const { getDatosHome ,getUniversidades, getAreasConocimiento, getAreasConocimientoUsuario} = require('./../controllers/home');

const router = Router();

// listar datos home
router.get('/', [], getDatosHome);

//Obtener universidades
router.get(
    '/universidades',[],
    getUniversidades
);

router.get(
    '/areasConocimiento',[],
    getAreasConocimiento
);


router.get(
    '/areasConocimientoUsuario/:id',[],
    getAreasConocimientoUsuario
);
module.exports = router;