// ruta: /api/uploads
// api/upload/5f1c34be4679e436144bf4b52 => sin default type
// api/upload/5f1c34be4679e436144bf4b52/avatar => default type = avatar

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { subirFichero, obtenerFichero, borrarFichero } = require('./../controllers/uploads');
const { opcionalJWT, validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.use(expressFileUpload());


router.get('/:upload_id', [opcionalJWT], obtenerFichero);
router.get('/:upload_id/:default_type', [opcionalJWT], obtenerFichero);
router.put('/:campo/:tipo/:tipo_id', [validarJWT], subirFichero);
router.delete('/:upload_id', [validarJWT], borrarFichero);

module.exports = router;