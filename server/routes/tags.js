// ruta: /api/utils
const { Router } = require('express')
const { computeTags, computePossibleTags } = require('../controllers/tags')

const router = Router()

//Obtener tags from a text
router.get('/computeTags', [], computeTags)


//Obtener alternatives tags from a text
router.get('/computePossibleTags', [], computePossibleTags)

module.exports = router
