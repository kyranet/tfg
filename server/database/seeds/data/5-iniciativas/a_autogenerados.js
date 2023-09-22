const { getObjectId, generateRandomImage, generateRandomDocument } = require("../../helpers");
const faker = require('faker');
faker.locale = 'es';
const { RAMAS } = require('../../../../../src/app/models/rama.model');
const { CIUDADES } = require('../../../../../src/app/models/ciudad.model');
const { ESTADOS_INICIATIVAS } = require('../../../../../src/app/models/estado-iniciativa.model');

const entities_to_generate = 75;

function generateIniciativas() {

  let iniciativas = []

  for (let id=1; id <= (entities_to_generate + 1); id++) {

    let rama = faker.random.arrayElement(RAMAS);
    let ciudad = faker.random.arrayElement(CIUDADES);
    let estado = faker.random.arrayElement(ESTADOS_INICIATIVAS);

    let proponedor = faker.random.arrayElement(['entidad@externo.es', 'profesor@externo.es', 'entidad@uned.es', 'profesor@uned.es']);

    let date = faker.date.recent();

    let titulo = faker.lorem.sentence();
    iniciativas.push({
       _id: getObjectId('iniciativa'+id+':' + titulo),
        estado: estado,
        titulo: titulo,
        descripcion: faker.lorem.text(),
        imagen: generateRandomImage('iniciativas', getObjectId('iniciativa'+id+':' + titulo), getObjectId(proponedor)),
        rama: rama,
        ciudad: ciudad,
        proponedor: getObjectId(proponedor),
        creador: getObjectId(proponedor),

        partenariados: [],
        archivos: faker.random.boolean(50) ? [generateRandomDocument('iniciativas', getObjectId('iniciativa'+id+':' + titulo), getObjectId(proponedor))] : [],

        createdAt: date,
        updatedAt: date,
    });
  }

  return iniciativas
}

module.exports = generateIniciativas();
